import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@bidflow/database';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  findAll(companyId: string, q: { category?: string; search?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 50, category, search } = q;
    const where: object = {
      companyId, isActive: true,
      ...(category && { category }),
      ...(search   && { name: { contains: search, mode: 'insensitive' as const } }),
    };
    return prisma.item.findMany({ where, skip: (page-1)*limit, take: limit, orderBy: { name: 'asc' } });
  }

  async findOne(companyId: string, id: string) {
    const item = await prisma.item.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  create(companyId: string, dto: CreateItemDto) {
    return prisma.item.create({ data: { companyId, ...dto } });
  }

  async update(companyId: string, id: string, dto: Partial<CreateItemDto>) {
    const item = await prisma.item.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException('Item not found');
    return prisma.item.update({ where: { id }, data: dto });
  }

  async deactivate(companyId: string, id: string) {
    const item = await prisma.item.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException('Item not found');
    return prisma.item.update({ where: { id }, data: { isActive: false } });
  }

  async getCategories(companyId: string): Promise<string[]> {
    const items = await prisma.item.findMany({ where: { companyId, isActive: true }, select: { category: true }, distinct: ['category'] });
    return items.map(i => i.category).filter(Boolean) as string[];
  }
}
