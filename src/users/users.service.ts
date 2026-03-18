import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { prisma } from '@bidflow/database';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  async findAll(companyId: string) {
    const users = await prisma.user.findMany({ where: { companyId }, orderBy: { firstName: 'asc' } });
    return users.map(({ passwordHash: _, ...u }) => u);
  }

  async findOne(companyId: string, id: string) {
    const user = await prisma.user.findFirst({ where: { id, companyId } });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async create(companyId: string, dto: CreateUserDto) {
    const exists = await prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { passwordHash: _, ...user } = await prisma.user.create({
      data: { companyId, email: dto.email, passwordHash, firstName: dto.firstName, lastName: dto.lastName, role: dto.role || 'BUYER' },
    });
    return user;
  }

  async update(companyId: string, requesterId: string, id: string, dto: UpdateUserDto) {
    const user = await prisma.user.findFirst({ where: { id, companyId } });
    if (!user) throw new NotFoundException('User not found');
    const data: Record<string, unknown> = {};
    if (dto.firstName)  data.firstName = dto.firstName;
    if (dto.lastName)   data.lastName  = dto.lastName;
    if (dto.role)       data.role      = dto.role;
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    const { passwordHash: _, ...updated } = await prisma.user.update({ where: { id }, data });
    return updated;
  }

  async deactivate(companyId: string, requesterId: string, id: string) {
    if (requesterId === id) throw new ForbiddenException('Cannot deactivate yourself');
    const user = await prisma.user.findFirst({ where: { id, companyId } });
    if (!user) throw new NotFoundException('User not found');
    return prisma.user.update({ where: { id }, data: { isActive: false } });
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: { select: { id: true, name: true, slug: true, plan: true } } },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
