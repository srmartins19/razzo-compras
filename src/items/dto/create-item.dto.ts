import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty()         @IsString()            name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional({ default: 'UN' })
  @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() lastPrice?: number;
  @ApiPropertyOptional({ default: 'BRL' })
  @IsOptional() @IsString() currency?: string;
}
