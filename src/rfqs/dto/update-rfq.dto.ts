import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRfqDto } from './create-rfq.dto';
import { RfqStatus } from '@bidflow/database';

export class UpdateRfqDto extends PartialType(CreateRfqDto) {
  @ApiPropertyOptional({ enum: RfqStatus })
  @IsOptional()
  @IsEnum(RfqStatus)
  status?: RfqStatus;
}
