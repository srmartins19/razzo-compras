import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'], credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  if (process.env.NODE_ENV !== 'production') {
    const cfg = new DocumentBuilder().setTitle('BidFlow API').setVersion('1.0').addBearerAuth().build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, cfg));
    logger.log('📚 Swagger: http://localhost:4000/api/docs');
  }
  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 API running on port ${port}`);
}
bootstrap();
