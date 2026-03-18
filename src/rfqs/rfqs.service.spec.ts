import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RfqsService } from './rfqs.service';
import { AuditService } from '../audit/audit.service';

jest.mock('@bidflow/database', () => ({
  prisma: {
    rfq: {
      count:   jest.fn().mockResolvedValue(0),
      create:  jest.fn(),
      findMany:jest.fn().mockResolvedValue([]),
      findFirst:jest.fn(),
      update:  jest.fn(),
    },
    rfqSupplier: { upsert: jest.fn() },
    bid: {
      findFirst:  jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn((cb: any) => cb({
      bid: { updateMany: jest.fn() },
      rfq: { update: jest.fn() },
    })),
  },
}));

const mockAudit = { log: jest.fn().mockResolvedValue(undefined) };

describe('RfqsService', () => {
  let service: RfqsService;
  const { prisma } = require('@bidflow/database');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RfqsService, { provide: AuditService, useValue: mockAudit }],
    }).compile();
    service = module.get<RfqsService>(RfqsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findOne', () => {
    it('throws NotFoundException when RFQ not found', async () => {
      (prisma.rfq.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne('c1', 'rfq-404')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('throws NotFoundException when RFQ not found', async () => {
      (prisma.rfq.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.updateStatus('c1', 'u1', 'rfq-404', 'OPEN' as any))
        .rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException for invalid transition', async () => {
      (prisma.rfq.findFirst as jest.Mock).mockResolvedValue({ id: 'r1', status: 'CLOSED' });
      await expect(service.updateStatus('c1', 'u1', 'r1', 'OPEN' as any))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getBidComparison', () => {
    it('throws NotFoundException when RFQ not found', async () => {
      (prisma.rfq.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getBidComparison('c1', 'rfq-404')).rejects.toThrow(NotFoundException);
    });

    it('returns empty array when no bids', async () => {
      (prisma.rfq.findFirst as jest.Mock).mockResolvedValue({ id: 'r1', items: [], bids: [] });
      const result = await service.getBidComparison('c1', 'r1');
      expect(result).toEqual([]);
    });
  });
});
