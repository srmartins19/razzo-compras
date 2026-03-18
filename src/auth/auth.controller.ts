import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Post('register')
  @ApiOperation({ summary: 'Register company + admin' })
  register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

  @Post('supplier/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supplier portal login' })
  supplierLogin(@Body() dto: LoginDto) { return this.auth.supplierLogin(dto); }
}
