import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyId } from '../common/decorators';
import { BillingService } from './billing.service';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}
  @Get('plans')
  getPlans() { return this.billing.getPlans(); }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  checkout(@CompanyId() cId: string, @Body() body: { plan: string }) {
    return this.billing.createCheckoutSession(cId, body.plan);
  }
}
