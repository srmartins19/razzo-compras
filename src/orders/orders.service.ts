import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma, OrderStatus } from '@bidflow/database';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class OrdersService {
  constructor(private readonly audit: AuditService) {}

  private async generateNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.order.count({ where: { companyId, createdAt: { gte: new Date(`${year}-01-01`) } } });
    return `PO-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  // Generate PO from winning bid
  async generateFromRfq(companyId: string, userId: string, rfqId: string) {
    const rfq = await prisma.rfq.findFirst({ where: { id: rfqId, companyId, status: 'CLOSED', winningSupplierId: { not: null } } });
    if (!rfq) throw new NotFoundException('Closed RFQ with winner not found');

    const winnerBid = await prisma.bid.findFirst({ where: { rfqId, isWinner: true }, include: { supplier: true } });
    if (!winnerBid) throw new NotFoundException('Winner bid not found');

    const number = await this.generateNumber(companyId);
    const order = await prisma.order.create({
      data: {
        companyId, rfqId, number,
        supplierId: winnerBid.supplierId,
        createdById: userId,
        totalAmount: winnerBid.totalPrice,
        currency: winnerBid.currency,
        paymentTerms: winnerBid.paymentTerms,
        deliveryDate: rfq.deliveryDate,
        deliveryAddress: rfq.deliveryAddress,
        status: 'DRAFT',
      },
      include: { supplier: true, rfq: { select: { number: true, title: true } } },
    });

    await this.audit.log({ companyId, userId, action: 'ORDER_CREATED', entityType: 'order', entityId: order.id, metadata: { number, rfqId, totalAmount: Number(winnerBid.totalPrice) } });
    return order;
  }

  async findAll(companyId: string, query: { status?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 20, status } = query;
    const where = { companyId, ...(status && { status: status as OrderStatus }) };
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { supplier: { select: { id: true, name: true } }, createdBy: { select: { firstName: true, lastName: true } }, rfq: { select: { number: true, title: true } } } }),
      prisma.order.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(companyId: string, userId: string, id: string, status: OrderStatus) {
    const order = await prisma.order.findFirst({ where: { id, companyId } });
    if (!order) throw new NotFoundException('Order not found');

    const transitions: Record<string, OrderStatus[]> = {
      DRAFT: ['PENDING_APPROVAL'],
      PENDING_APPROVAL: ['APPROVED', 'CANCELLED'],
      APPROVED: ['SENT', 'CANCELLED'],
      SENT: ['RECEIVED', 'CANCELLED'],
    };
    if (!transitions[order.status]?.includes(status)) throw new BadRequestException(`Cannot transition ${order.status} → ${status}`);

    const actionMap: Record<string, string> = { APPROVED: 'ORDER_APPROVED', SENT: 'ORDER_SENT', RECEIVED: 'ORDER_RECEIVED' };
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        approvedById: status === 'APPROVED' ? userId : undefined,
        approvedAt: status === 'APPROVED' ? new Date() : undefined,
        sentAt: status === 'SENT' ? new Date() : undefined,
        receivedAt: status === 'RECEIVED' ? new Date() : undefined,
      },
    });

    if (actionMap[status]) {
      await this.audit.log({ companyId, userId, action: actionMap[status] as any, entityType: 'order', entityId: id, metadata: { status } });
    }

    // Update supplier performance on receipt
    if (status === 'RECEIVED') await this.updateSupplierMetrics(order.supplierId, order.id);
    return updated;
  }

  private async updateSupplierMetrics(supplierId: string, orderId: string) {
    const orders = await prisma.order.count({ where: { supplierId, status: 'RECEIVED' } });
    await prisma.supplierPerformance.upsert({
      where: { supplierId },
      update: { totalOrders: orders, updatedAt: new Date() },
      create: { supplierId, totalOrders: orders },
    });
  }
}
