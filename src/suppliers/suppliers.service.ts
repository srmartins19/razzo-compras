import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '@bidflow/database';
import { EmailService } from '../common/services/email.service';
import * as bcrypt from 'bcrypt';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly email: EmailService) {}

  async findAll(companyId: string, q: { page?: number; limit?: number; search?: string; category?: string }) {
    const { page = 1, limit = 20, search, category } = q;
    const where: object = {
      companyId,
      ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] }),
      ...(category && { categories: { has: category } }),
    };
    const [data, total] = await Promise.all([
      prisma.supplier.findMany({ where, skip: (page-1)*limit, take: limit, orderBy: { name: 'asc' }, include: { performance: true } }),
      prisma.supplier.count({ where }),
    ]);
    const safeData = data.map(({ passwordHash: _, ...s }) => s);
    return { data: safeData, total, page, limit, totalPages: Math.ceil(total/limit) };
  }

  async findOne(companyId: string, id: string) {
    const s = await prisma.supplier.findFirst({ where: { id, companyId }, include: { performance: true } });
    if (!s) throw new NotFoundException('Supplier not found');
    const { passwordHash: _, ...safe } = s;
    return safe;
  }

  async create(companyId: string, dto: CreateSupplierDto) {
    const exists = await prisma.supplier.findFirst({ where: { email: dto.email, companyId } });
    if (exists) throw new ConflictException('Supplier with this email already exists');

    let passwordHash: string | undefined;
    const tempPassword = 'supplier123!';
    if (dto.enablePortal) passwordHash = await bcrypt.hash(tempPassword, 10);

    const { passwordHash: _, ...supplier } = await prisma.supplier.create({
      data: {
        companyId,
        name:         dto.name,
        email:        dto.email,
        contactName:  dto.contactName,
        phone:        dto.phone,
        taxId:        dto.taxId,
        website:      dto.website,
        country:      dto.country,
        categories:   dto.categories || [],
        portalAccess: !!dto.enablePortal,
        passwordHash,
      },
    });

    // Send welcome email if portal enabled
    if (dto.enablePortal) {
      await this.email.sendWelcomeSupplier(dto.email, dto.name,
        `${process.env.SUPPLIER_PORTAL_URL || 'http://localhost:3001'}`,
        tempPassword,
      ).catch(() => {});
    }

    return supplier;
  }

  async update(companyId: string, id: string, dto: UpdateSupplierDto) {
    const s = await prisma.supplier.findFirst({ where: { id, companyId } });
    if (!s) throw new NotFoundException('Supplier not found');
    const { passwordHash: _, ...updated } = await prisma.supplier.update({
      where: { id },
      data:  { name: dto.name, email: dto.email, contactName: dto.contactName, phone: dto.phone, taxId: dto.taxId, website: dto.website, country: dto.country, categories: dto.categories },
    });
    return updated;
  }

  async approve(companyId: string, id: string) {
    const s = await prisma.supplier.findFirst({ where: { id, companyId } });
    if (!s) throw new NotFoundException('Supplier not found');
    return prisma.supplier.update({ where: { id }, data: { isApproved: true } });
  }

  async deactivate(companyId: string, id: string) {
    const s = await prisma.supplier.findFirst({ where: { id, companyId } });
    if (!s) throw new NotFoundException('Supplier not found');
    return prisma.supplier.update({ where: { id }, data: { isActive: false } });
  }
}

  async updatePerformance(supplierId: string, dto: { deliveryScore: number; qualityScore: number; priceScore: number; serviceScore: number }) {
    const { deliveryScore, qualityScore, priceScore, serviceScore } = dto;
    const overall = 0.4 * priceScore + 0.3 * deliveryScore + 0.2 * qualityScore + 0.1 * serviceScore;
    return prisma.supplierPerformance.upsert({
      where:  { supplierId },
      update: { deliveryScore, qualityScore, priceScore, serviceScore, overallScore: +overall.toFixed(2), updatedAt: new Date() },
      create: { supplierId, deliveryScore, qualityScore, priceScore, serviceScore, overallScore: +overall.toFixed(2) },
    });
  }
