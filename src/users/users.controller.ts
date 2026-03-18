import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CurrentUser, CompanyId } from '../common/decorators';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  me(@CurrentUser() u: { id: string }) { return this.svc.getProfile(u.id); }

  @Get()
  @ApiOperation({ summary: 'List company users' })
  findAll(@CompanyId() cId: string) { return this.svc.findAll(cId); }

  @Get(':id')
  @ApiOperation({ summary: 'Get user detail' })
  findOne(@CompanyId() cId: string, @Param('id') id: string) { return this.svc.findOne(cId, id); }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create user' })
  create(@CompanyId() cId: string, @Body() dto: CreateUserDto) { return this.svc.create(cId, dto); }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update user' })
  update(@CompanyId() cId: string, @CurrentUser() u: { id: string }, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.svc.update(cId, u.id, id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Deactivate user' })
  deactivate(@CompanyId() cId: string, @CurrentUser() u: { id: string }, @Param('id') id: string) {
    return this.svc.deactivate(cId, u.id, id);
  }
}
