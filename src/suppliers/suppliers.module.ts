import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { EmailService } from '../common/services/email.service';

@Module({
  controllers: [SuppliersController],
  providers:   [SuppliersService, EmailService],
  exports:     [SuppliersService],
})
export class SuppliersModule {}
