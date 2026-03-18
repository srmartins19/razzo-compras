import { Module } from '@nestjs/common';
import { RfqsController } from './rfqs.controller';
import { RfqsService } from './rfqs.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [RfqsController],
  providers: [RfqsService],
  exports: [RfqsService],
})
export class RfqsModule {}
