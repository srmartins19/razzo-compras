import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyId } from '../common/decorators';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard KPIs' })
  dashboard(@CompanyId() companyId: string) { return this.analytics.getDashboard(companyId); }

  @Get('item-price-history/:itemId')
  @ApiOperation({ summary: 'Price intelligence for an item' })
  priceHistory(@CompanyId() companyId: string, @Param('itemId') itemId: string) {
    return this.analytics.getItemPriceHistory(companyId, itemId);
  }

  @Get('supplier-ranking')
  @ApiOperation({ summary: 'Supplier scoring & ranking' })
  supplierRanking(@CompanyId() companyId: string) { return this.analytics.getSupplierRanking(companyId); }

  @Get('monthly')
  @ApiOperation({ summary: 'Monthly procurement metrics' })
  monthly(@CompanyId() companyId: string, @Query('months') months?: string) {
    return this.analytics.getMonthlyMetrics(companyId, Number(months) || 12);
  }

  @Get('supplier-participation')
  @ApiOperation({ summary: 'Supplier participation rate' })
  participation(@CompanyId() companyId: string) { return this.analytics.getSupplierParticipation(companyId); }
}
