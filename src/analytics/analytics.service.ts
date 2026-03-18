import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@bidflow/database';
import { DashboardMetrics, PriceIntelligence, SupplierScore, MonthlyMetric } from '@bidflow/types';

@Injectable()
export class AnalyticsService {

  // ── Dashboard KPIs ────────────────────────────
  async getDashboard(companyId: string): Promise<DashboardMetrics> {
    const [openRfqs, activeSuppliers, pendingOrders, rfqsThisMonth, metrics] = await Promise.all([
      prisma.rfq.count({ where: { companyId, status: { in: ['OPEN', 'ANALYSIS'] } } }),
      prisma.supplier.count({ where: { companyId, isActive: true, isApproved: true } }),
      prisma.order.count({ where: { companyId, status: 'PENDING_APPROVAL' } }),
      prisma.rfq.count({ where: { companyId, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
      prisma.procurementMetric.findFirst({ where: { companyId }, orderBy: { month: 'desc' } }),
    ]);

    // Calculate savings from closed RFQs
    const closedRfqs = await prisma.rfq.findMany({
      where: { companyId, status: 'CLOSED', winningSupplierId: { not: null } },
      include: { bids: { select: { totalPrice: true, isWinner: true } } },
    });

    let totalSavings = 0;
    let totalSpend = 0;
    closedRfqs.forEach((rfq) => {
      const prices = rfq.bids.map((b) => Number(b.totalPrice));
      const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
      const winnerBid = rfq.bids.find((b) => b.isWinner);
      if (winnerBid) {
        const winnerPrice = Number(winnerBid.totalPrice);
        totalSavings += Math.max(0, avgPrice - winnerPrice);
        totalSpend += winnerPrice;
      }
    });

    const savingsPct = totalSpend > 0 ? (totalSavings / (totalSpend + totalSavings)) * 100 : 0;

    return {
      totalSavings,
      totalSavingsPct: Number(savingsPct.toFixed(2)),
      activeSuppliers,
      rfqsThisMonth,
      openRfqs,
      avgCycleTimeDays: metrics?.avgCycleTimeDays || 0,
      totalSpendMtd: metrics ? Number(metrics.totalSpend) : 0,
      pendingApprovals: pendingOrders,
    };
  }

  // ── Price Intelligence ────────────────────────
  async getItemPriceHistory(companyId: string, itemId: string): Promise<PriceIntelligence> {
    const item = await prisma.item.findFirst({ where: { id: itemId, companyId } });
    if (!item) throw new NotFoundException('Item not found');

    const history = await prisma.priceHistory.findMany({
      where: { itemId },
      include: { supplier: { select: { id: true, name: true } } },
      orderBy: { date: 'asc' },
    });

    if (!history.length) {
      return { itemId, itemName: item.name, currency: 'BRL', avgPrice: 0, minPrice: 0, maxPrice: 0, lastPrice: 0, priceTrend: 'STABLE', trendPct: 0, dataPoints: [] };
    }

    const prices = history.map((h) => Number(h.price));
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const lastPrice = prices[prices.length - 1];

    // Trend: compare last 3 vs first 3 data points
    let priceTrend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
    let trendPct = 0;
    if (prices.length >= 2) {
      const first = prices.slice(0, Math.ceil(prices.length / 2));
      const last = prices.slice(Math.floor(prices.length / 2));
      const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
      const lastAvg = last.reduce((a, b) => a + b, 0) / last.length;
      trendPct = firstAvg > 0 ? ((lastAvg - firstAvg) / firstAvg) * 100 : 0;
      if (trendPct > 2) priceTrend = 'UP';
      else if (trendPct < -2) priceTrend = 'DOWN';
    }

    return {
      itemId, itemName: item.name, currency: 'BRL',
      avgPrice: Number(avgPrice.toFixed(2)),
      minPrice, maxPrice, lastPrice,
      priceTrend, trendPct: Number(trendPct.toFixed(2)),
      dataPoints: history.map((h) => ({
        date: h.date.toISOString(),
        price: Number(h.price),
        supplierId: h.supplierId,
        supplierName: h.supplier.name,
        rfqId: h.rfqId || undefined,
      })),
    };
  }

  // ── Supplier Scoring Engine ───────────────────
  // Score = 0.4 × price + 0.3 × delivery + 0.2 × quality + 0.1 × service
  async getSupplierRanking(companyId: string): Promise<SupplierScore[]> {
    const suppliers = await prisma.supplier.findMany({
      where: { companyId, isActive: true, isApproved: true },
      include: { performance: true },
    });

    const scores: SupplierScore[] = suppliers.map((s) => {
      const perf = s.performance;
      const priceScore = perf?.priceScore || 5;
      const deliveryScore = perf?.deliveryScore || 5;
      const qualityScore = perf?.qualityScore || 5;
      const serviceScore = perf?.serviceScore || 5;
      const overallScore = 0.4 * priceScore + 0.3 * deliveryScore + 0.2 * qualityScore + 0.1 * serviceScore;

      return {
        supplierId: s.id,
        supplierName: s.name,
        overallScore: Number(overallScore.toFixed(2)),
        deliveryScore, qualityScore, priceScore, serviceScore,
        totalOrders: perf?.totalOrders || 0,
        ranking: 0,
      };
    });

    scores.sort((a, b) => b.overallScore - a.overallScore);
    scores.forEach((s, i) => { s.ranking = i + 1; });
    return scores;
  }

  // ── Monthly Metrics ───────────────────────────
  async getMonthlyMetrics(companyId: string, months = 12): Promise<MonthlyMetric[]> {
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    from.setDate(1); from.setHours(0, 0, 0, 0);

    const metrics = await prisma.procurementMetric.findMany({
      where: { companyId, month: { gte: from } },
      orderBy: { month: 'asc' },
    });

    return metrics.map((m) => ({
      month: m.month.toISOString().slice(0, 7),
      rfqsCreated: m.rfqsCreated,
      ordersCreated: m.ordersCreated,
      totalSpend: Number(m.totalSpend),
      totalSavings: Number(m.totalSavings),
      avgCycleTimeDays: m.avgCycleTimeDays,
    }));
  }

  // ── Supplier Participation Rate ───────────────
  async getSupplierParticipation(companyId: string) {
    const [totalInvites, totalResponses] = await Promise.all([
      prisma.rfqSupplier.count({ where: { rfq: { companyId } } }),
      prisma.rfqSupplier.count({ where: { rfq: { companyId }, respondedAt: { not: null } } }),
    ]);
    const rate = totalInvites > 0 ? (totalResponses / totalInvites) * 100 : 0;
    return { totalInvites, totalResponses, participationRate: Number(rate.toFixed(2)) };
  }
}
