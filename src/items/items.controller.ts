import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CompanyId } from '../common/decorators';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@ApiTags('items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly svc: ItemsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get unique item categories' })
  categories(@CompanyId() cId: string) { return this.svc.getCategories(cId); }

  @Get()
  @ApiOperation({ summary: 'List procurement items' })
  findAll(@CompanyId() cId: string, @Query() q: { category?: string; search?: string; page?: string; limit?: string }) {
    return this.svc.findAll(cId, { ...q, page: Number(q.page)||1, limit: Number(q.limit)||50 });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item detail' })
  findOne(@CompanyId() cId: string, @Param('id') id: string) { return this.svc.findOne(cId, id); }

  @Post()
  @Roles('ADMIN', 'BUYER')
  @ApiOperation({ summary: 'Create catalog item' })
  create(@CompanyId() cId: string, @Body() dto: CreateItemDto) { return this.svc.create(cId, dto); }

  @Patch(':id')
  @Roles('ADMIN', 'BUYER')
  @ApiOperation({ summary: 'Update item' })
  update(@CompanyId() cId: string, @Param('id') id: string, @Body() dto: Partial<CreateItemDto>) {
    return this.svc.update(cId, id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Deactivate item' })
  remove(@CompanyId() cId: string, @Param('id') id: string) { return this.svc.deactivate(cId, id); }
}
