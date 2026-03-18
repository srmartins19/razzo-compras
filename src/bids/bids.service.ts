import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { prisma } from '@bidflow/database';
import { AuditService } from '../audit/audit.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidsService {
  constructor(private readonly audit: AuditService) {}

  async submit(supplierId: string, companyId: string, rfqId: string, dto: CreateBidDto) {
    const rfq = await prisma.rfq.findFirst({
      where: { id: rfqId, companyId },
      include: { items: true, suppliers: { where: { supplierId } } },
    });
    if (!rfq) throw new NotFoundException('RFQ not found');
    if (rfq.status !== 'OPEN') throw new BadRequestException('RFQ is not open for bidding');
    if (!rfq.suppliers.length) throw new ForbiddenException('Not invited to this RFQ');
    if (new Date() > rfq.deadline) throw new BadRequestException('Bidding deadline has passed');

    // Auction: allow updates if enabled and within window
    const existingBid = await prisma.bid.findUnique({ where: { rfqId_supplierId: { rfqId, supplierId } } });
    if (existingBid && !rfq.auctionEnabled) throw new BadRequestException('Bid already submitted');
    if (existingBid && rfq.auctionEnabled && rfq.auctionEndTime && new Date() > rfq.auctionEndTime) {
      throw new BadRequestException('Auction has ended');
    }

    const totalPrice = dto.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const bid = await prisma.$transaction(async (tx) => {
      if (existingBid) {
        await tx.bidItem.deleteMany({ where: { bidId: existingBid.id } });
        return tx.bid.update({
          where: { id: existingBid.id },
          data: { totalPrice, deliveryDays: dto.deliveryDays, paymentTerms: dto.paymentTerms, warranty: dto.warranty, notes: dto.notes, items: { create: dto.items } },
          include: { items: true, supplier: { select: { id: true, name: true } } },
        });
      }
      return tx.bid.create({
        data: { rfqId, supplierId, totalPrice, currency: dto.currency || 'BRL', deliveryDays: dto.deliveryDays, paymentTerms: dto.paymentTerms, warranty: dto.warranty, notes: dto.notes, items: { create: dto.items } },
        include: { items: true, supplier: { select: { id: true, name: true } } },
      });
    });

    // Update supplier responded_at
    await prisma.rfqSupplier.update({ where: { rfqId_supplierId: { rfqId, supplierId } }, data: { respondedAt: new Date() } });

    // Record price history for each item
    await Promise.all(dto.items.map(async (bidItem) => {
      const rfqItem = rfq.items.find((ri) => ri.id === bidItem.rfqItemId);
      if (rfqItem?.itemId) {
        await prisma.priceHistory.create({ data: { itemId: rfqItem.itemId, supplierId, rfqId, price: bidItem.unitPrice, currency: dto.currency || 'BRL' } }).catch(() => {});
      }
    }));

    await this.audit.log({ companyId, userId: supplierId, action: 'BID_SUBMITTED', entityType: 'bid', entityId: bid.id, metadata: { rfqId, totalPrice } });
    return bid;
  }

  async findByRfq(companyId: string, rfqId: string) {
    const rfq = await prisma.rfq.findFirst({ where: { id: rfqId, companyId } });
    if (!rfq) throw new NotFoundException('RFQ not found');
    return prisma.bid.findMany({
      where: { rfqId },
      include: { supplier: { select: { id: true, name: true, email: true } }, items: { include: { rfqItem: true } } },
      orderBy: { totalPrice: 'asc' },
    });
  }
}
