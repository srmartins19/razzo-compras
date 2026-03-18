import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ItemsModule } from './items/items.module';
import { RfqsModule } from './rfqs/rfqs.module';
import { BidsModule } from './bids/bids.module';
import { OrdersModule } from './orders/orders.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { BillingModule } from './billing/billing.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule, UsersModule, CompaniesModule, SuppliersModule,
    ItemsModule, RfqsModule, BidsModule, OrdersModule,
    AnalyticsModule, BillingModule, AuditModule,
  ],
})
export class AppModule {}
