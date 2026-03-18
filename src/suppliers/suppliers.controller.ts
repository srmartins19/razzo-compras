import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CompanyId } from '../common/decorators';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@ApiTags('suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly svc: SuppliersService) {}

  @Get()
  @ApiOperation({ summary: 'List suppliers' })
  findAll(@CompanyId() cId: string, @Query() q: { page?: string; limit?: string; search?: string; category?: string }) {
    return this.svc.findAll(cId, { ...q, page: Number(q.page)||1, limit: Number(q.limit)||20 });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier detail' })
  findOne(@CompanyId() cId: string, @Param('id') id: string) {
    return this.svc.findOne(cId, id);
  }

  @Post()
  @Roles('ADMIN', 'BUYER')
  @ApiOperation({ summary: 'Create supplier' })
  create(@CompanyId() cId: string, @Body() dto: CreateSupplierDto) {
    return this.svc.create(cId, dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'BUYER')
  @ApiOperation({ summary: 'Update supplier' })
  update(@CompanyId() cId: string, @Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.svc.update(cId, id, dto);
  }

  @Patch(':id/approve')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Approve supplier' })
  approve(@CompanyId() cId: string, @Param('id') id: string) {
    return this.svc.approve(cId, id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Deactivate supplier' })
  deactivate(@CompanyId() cId: string, @Param('id') id: string) {
    return this.svc.deactivate(cId, id);
  }
}

  // (append method — already imported above)
