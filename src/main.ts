import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app    = await NestFactory.create(AppModule, { logger: ['error','warn','log'] });

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin:      process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000','http://localhost:3001'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist:             true,
    forbidNonWhitelisted:  true,
    transform:             true,
    transformOptions:      { enableImplicitConversion: true },
  }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger (dev only)
  if (process.env.NODE_ENV !== 'production') {
    const cfg = new DocumentBuilder()
      .setTitle('BidFlow API')
      .setDescription('Strategic Sourcing & Procurement Platform API')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .addTag('auth',      'Authentication')
      .addTag('rfqs',      'RFQ Management')
      .addTag('bids',      'Bid Submission')
      .addTag('suppliers', 'Supplier Management')
      .addTag('orders',    'Purchase Orders')
      .addTag('analytics', 'Analytics & Reporting')
      .addTag('billing',   'Subscription & Billing')
      .addTag('audit',     'Audit Logs')
      .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, cfg));
    logger.log('📚 Swagger: http://localhost:4000/api/docs');
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 BidFlow API running on http://localhost:${port}`);
  logger.log(`🏢 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
