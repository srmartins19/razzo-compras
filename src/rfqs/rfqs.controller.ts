import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CurrentUser, CompanyId } from '../common/decorators';
import { RfqsService } from './rfqs.service';
import { CreateRfqDto } from './dto/create-rfq.dto';

@ApiTags('rfqs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rfqs')
export class RfqsController {
  constructor(private readonly rfqs: RfqsService) {}

  @Post()
  @Roles('ADMIN', 'BUYER')
  @ApiOperation({ summary: 'Create new RFQ' })
  create(@CompanyId() companyId: string, @CurrentUser() user: { id: string }, @Body() dto: CreateRfqDto) {
    return this.rfqs.create(companyId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List RFQs' })
  findAll(@CompanyId() companyId: string, @Query() query: { status?: string; page?: string; limit?: string; search?: string }) {
    return this.rfqs.findAll(companyId, { ...query, page: Number(query.page) || 1, limit: Number(query.limit) || 20 });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RFQ detail' })
  findOne(@CompanyId() companyId: string, @Param('id') id: string) {
    return this.rfqs.findOne(companyId, id);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'BUYER')
  @ApiOperation({ summary: 'Update RFQ status' })
  updateStatus(@CompanyId() companyId: string, @CurrentUser() user: { id: string }, @Param('id') id: string, @Body() body: { status: string }) {
    return this.rfqs.updateStatus(companyId, user.id, id, body.status as any);
  }

  @Post(':id/invite-suppliers')
  @Roles('ADMIN', 'BUYER')
  @ApiOperation({ summary: 'Invite suppliers to RFQ' })
  inviteSuppliers(@CompanyId() companyId: string, @CurrentUser() user: { id: string }, @Param('id') id: string, @Body() body: { supplierIds: string[] }) {
    return this.rfqs.inviteSuppliers(companyId, user.id, id, body.supplierIds);
  }

  @Get(':id/comparison')
  @ApiOperation({ summary: 'Bid comparison matrix' })
  getComparison(@CompanyId() companyId: string, @Param('id') id: string) {
    return this.rfqs.getBidComparison(companyId, id);
  }

  @Post(':id/select-winner')
  @Roles('ADMIN', 'BUYER', 'APPROVER')
  @ApiOperation({ summary: 'Select winning supplier' })
  selectWinner(@CompanyId() companyId: string, @CurrentUser() user: { id: string }, @Param('id') id: string, @Body() body: { supplierId: string }) {
    return this.rfqs.selectWinner(companyId, user.id, id, body.supplierId);
  }
}
