import { IsString, IsOptional, IsNumber, IsDateString, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()            @IsString()                supplierId: string;
  @ApiProperty()            @IsNumber() @IsPositive()  totalAmount: number;
  @ApiPropertyOptional()    @IsOptional() @IsString()  rfqId?: string;
  @ApiPropertyOptional()    @IsOptional() @IsString()  paymentTerms?: string;
  @ApiPropertyOptional()    @IsOptional() @IsDateString() deliveryDate?: string;
  @ApiPropertyOptional()    @IsOptional() @IsString()  deliveryAddress?: string;
  @ApiPropertyOptional()    @IsOptional() @IsString()  notes?: string;
  @ApiPropertyOptional({ default: 'BRL' })
  @IsOptional() @IsString() currency?: string;
}
