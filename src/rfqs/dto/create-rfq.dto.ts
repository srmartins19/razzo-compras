import { IsString, IsOptional, IsDateString, IsBoolean, IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RfqItemDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsOptional() @IsString() itemId?: string;
  @ApiProperty() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsNumber() @IsPositive() quantity: number;
  @ApiProperty({ default: 'UN' }) @IsOptional() @IsString() unit?: string;
  @ApiProperty() @IsOptional() @IsNumber() estimatedPrice?: number;
}

export class CreateRfqDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsDateString() deadline: string;
  @ApiProperty() @IsOptional() @IsDateString() deliveryDate?: string;
  @ApiProperty() @IsOptional() @IsString() deliveryAddress?: string;
  @ApiProperty() @IsOptional() @IsString() paymentTerms?: string;
  @ApiProperty() @IsOptional() @IsString() notes?: string;
  @ApiProperty({ default: 'BRL' }) @IsOptional() @IsString() currency?: string;
  @ApiProperty({ default: false }) @IsOptional() @IsBoolean() auctionEnabled?: boolean;
  @ApiProperty() @IsOptional() @IsDateString() auctionEndTime?: string;
  @ApiProperty({ type: [RfqItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => RfqItemDto) items: RfqItemDto[];
}
