import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiPropertyOptional() @IsOptional() @IsString()  name?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail()   email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString()  phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString()  taxId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString()  website?: string;
  @ApiPropertyOptional() @IsOptional() @IsString()  logoUrl?: string;
}
