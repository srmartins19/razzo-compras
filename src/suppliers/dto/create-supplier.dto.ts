import { IsString, IsEmail, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty()            @IsString()            name: string;
  @ApiProperty()            @IsEmail()             email: string;
  @ApiPropertyOptional()    @IsOptional() @IsString() contactName?: string;
  @ApiPropertyOptional()    @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional()    @IsOptional() @IsString() taxId?: string;
  @ApiPropertyOptional()    @IsOptional() @IsString() website?: string;
  @ApiPropertyOptional()    @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray()  categories?: string[];
  @ApiPropertyOptional({ default: false })
  @IsOptional() @IsBoolean() enablePortal?: boolean;
}
