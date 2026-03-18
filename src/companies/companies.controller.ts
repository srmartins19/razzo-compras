import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CurrentUser, CompanyId } from '../common/decorators';
import { CompaniesService } from './companies.service';
@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('company')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}
  @Get() getMyCompany(@CompanyId() cId: string) { return this.companies.findOne(cId); }
  @Patch() @Roles('ADMIN') update(@CompanyId() cId: string, @Body() dto: any) { return this.companies.update(cId, dto); }
}
