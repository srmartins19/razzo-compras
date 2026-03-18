import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

jest.mock('@bidflow/database', () => ({
  prisma: {
    rfq:            { count: jest.fn().mockResolvedValue(3), findMany: jest.fn().mockResolvedValue([]) },
    supplier:       { count: jest.fn().mockResolvedValue(10), findMany: jest.fn().mockResolvedValue([]) },
    order:          { count: jest.fn().mockResolvedValue(2) },
    procurementMetric: { findFirst: jest.fn().mockResolvedValue(null), findMany: jest.fn().mockResolvedValue([]) },
    item:           { findFirst: jest.fn() },
    priceHistory:   { findMany: jest.fn().mockResolvedValue([]) },
    rfqSupplier:    { count: jest.fn().mockResolvedValue(0) },
  },
}));

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  const { prisma } = require('@bidflow/database');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService],
    }).compile();
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getDashboard', () => {
    it('returns KPI object with required fields', async () => {
      const kpis = await service.getDashboard('c1');
      expect(kpis).toHaveProperty('totalSavings');
      expect(kpis).toHaveProperty('activeSuppliers');
      expect(kpis).toHaveProperty('openRfqs');
      expect(kpis).toHaveProperty('rfqsThisMonth');
      expect(kpis).toHaveProperty('avgCycleTimeDays');
    });
  });

  describe('getItemPriceHistory', () => {
    it('throws NotFoundException when item not found', async () => {
      (prisma.item.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getItemPriceHistory('c1', 'item-404'))
        .rejects.toThrow(NotFoundException);
    });

    it('returns stable trend with no history', async () => {
      (prisma.item.findFirst as jest.Mock).mockResolvedValue({ id: 'i1', name: 'Test' });
      (prisma.priceHistory.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.getItemPriceHistory('c1', 'i1');
      expect(result.priceTrend).toBe('STABLE');
      expect(result.avgPrice).toBe(0);
    });
  });

  describe('getSupplierRanking', () => {
    it('returns sorted array', async () => {
      const ranking = await service.getSupplierRanking('c1');
      expect(Array.isArray(ranking)).toBe(true);
    });
  });

  describe('getSupplierParticipation', () => {
    it('returns participationRate of 0 when no invites', async () => {
      const result = await service.getSupplierParticipation('c1');
      expect(result.participationRate).toBe(0);
    });
  });
});
