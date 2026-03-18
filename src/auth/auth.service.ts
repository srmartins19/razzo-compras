import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '@bidflow/database';
import { JwtPayload } from '@bidflow/types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: { select: { id: true, name: true, slug: true, plan: true } } },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    if (!await bcrypt.compare(dto.password, user.passwordHash)) throw new UnauthorizedException('Invalid credentials');
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const payload: JwtPayload = { sub: user.id, email: user.email, companyId: user.companyId, role: user.role, type: 'user' };
    const { passwordHash: _, ...safe } = user;
    return { accessToken: this.jwt.sign(payload), refreshToken: this.jwt.sign(payload, { expiresIn: '30d' }), expiresIn: 604800, user: safe };
  }

  async supplierLogin(dto: LoginDto) {
    const supplier = await prisma.supplier.findFirst({ where: { email: dto.email, portalAccess: true, isActive: true } });
    if (!supplier?.passwordHash) throw new UnauthorizedException('Invalid credentials');
    if (!await bcrypt.compare(dto.password, supplier.passwordHash)) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { sub: supplier.id, email: supplier.email, companyId: supplier.companyId, role: 'SUPPLIER', type: 'supplier' };
    const { passwordHash: _, ...safe } = supplier;
    return { accessToken: this.jwt.sign(payload), refreshToken: this.jwt.sign(payload, { expiresIn: '30d' }), expiresIn: 604800, supplier: safe };
  }

  async register(dto: RegisterDto) {
    if (await prisma.user.findUnique({ where: { email: dto.email } })) throw new ConflictException('Email already registered');
    if (await prisma.company.findUnique({ where: { slug: dto.companySlug } })) throw new ConflictException('Company slug taken');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({ data: { name: dto.companyName, slug: dto.companySlug, email: dto.email } });
      await tx.user.create({ data: { companyId: company.id, email: dto.email, passwordHash, firstName: dto.firstName, lastName: dto.lastName, role: 'ADMIN' } });
    });
    return { message: 'Account created. Please sign in.' };
  }

  async validateUser(payload: JwtPayload) {
    if (payload.type === 'supplier') return prisma.supplier.findFirst({ where: { id: payload.sub, isActive: true } });
    return prisma.user.findFirst({ where: { id: payload.sub, isActive: true }, include: { company: true } });
  }
}
