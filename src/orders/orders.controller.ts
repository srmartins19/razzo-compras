import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CurrentUser, CompanyId } from '../common/decorators';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post('generate-from-rfq/:rfqId')
  @Roles('ADMIN', 'BUYER')
  @ApiOperation({ summary: 'Generate PO from winning bid' })
  generateFromRfq(@CompanyId() cId: string, @CurrentUser() u: { id: string }, @Param('rfqId') rfqId: string) {
    return this.orders.generateFromRfq(cId, u.id, rfqId);
  }

  @Get()
  @ApiOperation({ summary: 'List purchase orders' })
  findAll(@CompanyId() cId: string, @Query() q: { status?: string; page?: string; limit?: string }) {
    return this.orders.findAll(cId, { ...q, page: Number(q.page) || 1, limit: Number(q.limit) || 20 });
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'BUYER', 'APPROVER')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@CompanyId() cId: string, @CurrentUser() u: { id: string }, @Param('id') id: string, @Body() body: { status: string }) {
    return this.orders.updateStatus(cId, u.id, id, body.status as any);
  }
}
