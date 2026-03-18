import { Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { AuditModule } from '../audit/audit.module';
@Module({ imports: [AuditModule], controllers: [BidsController], providers: [BidsService], exports: [BidsService] })
export class BidsModule {}
