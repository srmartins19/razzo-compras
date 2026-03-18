import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { prisma, RfqStatus } from '@bidflow/database';
import { BidComparisonRow } from '@bidflow/types';
import { AuditService } from '../audit/audit.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';

@Injectable()
export class RfqsService {
  constructor(private readonly audit: AuditService) {}

  private async generateNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.rfq.count({ where: { companyId, createdAt: { gte: new Date(`${year}-01-01`) } } });
    return `RFQ-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async create(companyId: string, userId: string, dto: CreateRfqDto) {
    const number = await this.generateNumber(companyId);
    const rfq = await prisma.rfq.create({
      data: {
        companyId, createdById: userId, number,
        title: dto.title, description: dto.description,
        deadline: new Date(dto.deadline),
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        deliveryAddress: dto.deliveryAddress, paymentTerms: dto.paymentTerms,
        notes: dto.notes, currency: dto.currency || 'BRL',
        auctionEnabled: dto.auctionEnabled || false,
        auctionEndTime: dto.auctionEndTime ? new Date(dto.auctionEndTime) : null,
        items: {
          create: dto.items.map((item) => ({
            itemId: item.itemId, name: item.name,
            description: item.description, quantity: item.quantity,
            unit: item.unit || 'UN', estimatedPrice: item.estimatedPrice,
          })),
        },
      },
      include: { items: true, createdBy: { select: { firstName: true, lastName: true } } },
    });

    await this.audit.log({ companyId, userId, action: 'RFQ_CREATED', entityType: 'rfq', entityId: rfq.id, metadata: { number, title: rfq.title } });
    return rfq;
  }

  async findAll(companyId: string, query: { status?: string; page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, status, search } = query;
    const where: object = {
      companyId,
      ...(status && { status: status as RfqStatus }),
      ...(search && { OR: [{ title: { contains: search, mode: 'insensitive' } }, { number: { contains: search } }] }),
    };
    const [data, total] = await Promise.all([
      prisma.rfq.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: { select: { id: true } }, suppliers: { select: { id: true } }, bids: { select: { id: true } }, createdBy: { select: { firstName: true, lastName: true } } },
      }),
      prisma.rfq.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(companyId: string, id: string) {
    const rfq = await prisma.rfq.findFirst({
      where: { id, companyId },
      include: {
        items: { include: { item: true } },
        suppliers: { include: { supplier: { select: { id: true, name: true, email: true } } } },
        bids: { include: { supplier: { select: { id: true, name: true } }, items: true } },
        createdBy: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    if (!rfq) throw new NotFoundException('RFQ not found');
    return rfq;
  }

  async updateStatus(companyId: string, userId: string, id: string, status: RfqStatus) {
    const rfq = await prisma.rfq.findFirst({ where: { id, companyId } });
    if (!rfq) throw new NotFoundException('RFQ not found');

    const validTransitions: Record<string, RfqStatus[]> = {
      DRAFT: ['OPEN'],
      OPEN: ['ANALYSIS', 'CLOSED'],
      ANALYSIS: ['CLOSED'],
    };
    if (!validTransitions[rfq.status]?.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${rfq.status} to ${status}`);
    }

    const updated = await prisma.rfq.update({
      where: { id },
      data: { status, closedAt: status === 'CLOSED' ? new Date() : undefined },
    });

    await this.audit.log({ companyId, userId, action: status === 'CLOSED' ? 'RFQ_CLOSED' : 'RFQ_OPENED', entityType: 'rfq', entityId: id, metadata: { status } });
    return updated;
  }

  async inviteSuppliers(companyId: string, userId: string, rfqId: string, supplierIds: string[]) {
    const rfq = await prisma.rfq.findFirst({ where: { id: rfqId, companyId } });
    if (!rfq) throw new NotFoundException('RFQ not found');
    if (rfq.status !== 'OPEN') throw new BadRequestException('RFQ must be OPEN to invite suppliers');

    const invites = await Promise.allSettled(
      supplierIds.map((supplierId) =>
        prisma.rfqSupplier.upsert({
          where: { rfqId_supplierId: { rfqId, supplierId } },
          update: {},
          create: { rfqId, supplierId },
        }),
      ),
    );

    await this.audit.log({ companyId, userId, action: 'SUPPLIER_INVITED', entityType: 'rfq', entityId: rfqId, metadata: { supplierIds, count: supplierIds.length } });
    return { invited: invites.filter((r) => r.status === 'fulfilled').length };
  }

  // ── Bid Comparison Matrix ─────────────────────
  async getBidComparison(companyId: string, rfqId: string): Promise<BidComparisonRow[]> {
    const rfq = await prisma.rfq.findFirst({
      where: { id: rfqId, companyId },
      include: { items: true, bids: { include: { supplier: true, items: true } } },
    });
    if (!rfq) throw new NotFoundException('RFQ not found');

    const allPrices = rfq.bids.map((b) => Number(b.totalPrice));
    const avgPrice = allPrices.length ? allPrices.reduce((a, b) => a + b, 0) / allPrices.length : 0;
    const minPrice = allPrices.length ? Math.min(...allPrices) : 0;

    const rows: BidComparisonRow[] = rfq.bids.map((bid) => {
      const total = Number(bid.totalPrice);
      const savingsVsAverage = avgPrice - total;
      const savingsPct = avgPrice > 0 ? ((savingsVsAverage / avgPrice) * 100) : 0;

      // Score: lower price = higher score
      const priceScore = minPrice > 0 ? (minPrice / total) * 10 : 5;
      const deliveryScore = Math.max(0, 10 - bid.deliveryDays / 5);
      const score = Number((priceScore * 0.6 + deliveryScore * 0.4).toFixed(2));

      return {
        supplierId: bid.supplierId,
        supplierName: bid.supplier.name,
        totalPrice: total,
        currency: bid.currency,
        deliveryDays: bid.deliveryDays,
        paymentTerms: bid.paymentTerms,
        warranty: bid.warranty,
        score,
        ranking: 0,
        savingsVsAverage,
        savingsPct: Number(savingsPct.toFixed(2)),
        items: rfq.items.map((rfqItem) => {
          const bidItem = bid.items.find((bi) => bi.rfqItemId === rfqItem.id);
          const itemPrices = rfq.bids.map((b) => {
            const bi = b.items.find((i) => i.rfqItemId === rfqItem.id);
            return bi ? Number(bi.unitPrice) : Infinity;
          });
          return {
            rfqItemId: rfqItem.id,
            itemName: rfqItem.name,
            quantity: Number(rfqItem.quantity),
            unit: rfqItem.unit,
            unitPrice: bidItem ? Number(bidItem.unitPrice) : 0,
            totalPrice: bidItem ? Number(bidItem.totalPrice) : 0,
            isBestPrice: bidItem ? Number(bidItem.unitPrice) === Math.min(...itemPrices) : false,
          };
        }),
      };
    });

    // Assign rankings
    rows.sort((a, b) => b.score - a.score);
    rows.forEach((row, i) => { row.ranking = i + 1; });
    return rows;
  }

  async selectWinner(companyId: string, userId: string, rfqId: string, supplierId: string) {
    const rfq = await prisma.rfq.findFirst({ where: { id: rfqId, companyId } });
    if (!rfq) throw new NotFoundException('RFQ not found');

    await prisma.$transaction(async (tx) => {
      await tx.bid.updateMany({ where: { rfqId }, data: { isWinner: false } });
      await tx.bid.updateMany({ where: { rfqId, supplierId }, data: { isWinner: true } });
      await tx.rfq.update({ where: { id: rfqId }, data: { winningSupplierId: supplierId, status: 'CLOSED', closedAt: new Date() } });
    });

    await this.audit.log({ companyId, userId, action: 'RFQ_CLOSED', entityType: 'rfq', entityId: rfqId, metadata: { winningSupplierId: supplierId } });
    return { message: 'Winner selected. You can now generate a Purchase Order.' };
  }
}
