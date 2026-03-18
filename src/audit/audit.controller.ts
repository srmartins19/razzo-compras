import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CompanyId } from '../common/decorators';
import { AuditService } from './audit.service';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('audit')
export class AuditController {
  constructor(private readonly audit: AuditService) {}
  @Get()
  findAll(@CompanyId() cId: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.audit.findAll(cId, Number(page) || 1, Number(limit) || 50);
  }
}
