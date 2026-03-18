import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePerformanceDto {
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) deliveryScore: number;
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) qualityScore:  number;
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) priceScore:    number;
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) serviceScore:  number;
}
