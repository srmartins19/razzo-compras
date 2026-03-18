import { Injectable } from '@nestjs/common';
import { prisma } from '@bidflow/database';
import { AuditAction } from '@bidflow/database';

interface AuditParams {
  companyId: string;
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: object;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  async log(params: AuditParams) {
    return prisma.auditLog.create({
      data: {
        companyId: params.companyId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata as any,
        ipAddress: params.ipAddress,
      },
    }).catch(() => {}); // never fail on audit
  }

  async findAll(companyId: string, page = 1, limit = 50) {
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({ where: { companyId }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { firstName: true, lastName: true, email: true } } } }),
      prisma.auditLog.count({ where: { companyId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
