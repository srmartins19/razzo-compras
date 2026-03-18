import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

// Mock prisma
jest.mock('@bidflow/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst:  jest.fn(),
      update:     jest.fn(),
      create:     jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
      create:     jest.fn(),
    },
    $transaction: jest.fn((cb: any) => cb({ user: { create: jest.fn() }, company: { create: jest.fn() } })),
  },
}));

const mockJwt = { sign: jest.fn().mockReturnValue('mock.jwt.token') };

describe('AuthService', () => {
  let service: AuthService;
  const { prisma } = require('@bidflow/database');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: mockJwt }],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('throws UnauthorizedException when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', password: 'pass' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user is inactive', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1', email: 'x@x.com', passwordHash: 'hash', isActive: false,
      });
      await expect(service.login({ email: 'x@x.com', password: 'pass' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('calls prisma.user.findFirst for type=user', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: '1' });
      await service.validateUser({ sub: '1', email: 'a@b.com', companyId: 'c1', role: 'BUYER', type: 'user' });
      expect(prisma.user.findFirst).toHaveBeenCalled();
    });

    it('calls prisma.supplier.findFirst for type=supplier', async () => {
      const { prisma: p } = require('@bidflow/database');
      p.supplier = { findFirst: jest.fn().mockResolvedValue({ id: '1' }) };
      await service.validateUser({ sub: '1', email: 'a@b.com', companyId: 'c1', role: 'SUPPLIER', type: 'supplier' });
    });
  });
});
