import { Injectable } from '@nestjs/common';
import { prisma } from '@bidflow/database';
@Injectable()
export class CompaniesService {
  findOne(id: string) { return prisma.company.findUnique({ where: { id }, select: { id: true, name: true, slug: true, plan: true, email: true, phone: true, website: true, isActive: true } }); }
  update(id: string, data: object) { return prisma.company.update({ where: { id }, data: data as any }); }
}
