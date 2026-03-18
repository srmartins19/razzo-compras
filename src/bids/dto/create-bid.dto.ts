import { IsString, IsOptional, IsNumber, IsPositive, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BidItemDto {
  @ApiProperty() @IsString() rfqItemId: string;
  @ApiProperty() @IsNumber() @IsPositive() unitPrice: number;
  @ApiProperty() @IsNumber() @IsPositive() totalPrice: number;
  @ApiProperty() @IsOptional() @IsString() notes?: string;
}

export class CreateBidDto {
  @ApiProperty() @IsInt() @Min(1) deliveryDays: number;
  @ApiProperty() @IsOptional() @IsString() paymentTerms?: string;
  @ApiProperty() @IsOptional() @IsString() warranty?: string;
  @ApiProperty() @IsOptional() @IsString() notes?: string;
  @ApiProperty({ default: 'BRL' }) @IsOptional() @IsString() currency?: string;
  @ApiProperty({ type: [BidItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => BidItemDto) items: BidItemDto[];
}
