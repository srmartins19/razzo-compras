import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BidFlow API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  describe('Auth', () => {
    it('POST /api/v1/auth/login — should return 401 with bad creds', () =>
      request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@test.com', password: 'wrongpass' })
        .expect(401),
    );

    it('POST /api/v1/auth/login — should return tokens with valid creds', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@razzo.com.br', password: 'admin123!' })
        .expect(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('user');
      accessToken = res.body.accessToken;
    });
  });

  describe('Billing (public)', () => {
    it('GET /api/v1/billing/plans — should return plan list', () =>
      request(app.getHttpServer())
        .get('/api/v1/billing/plans')
        .expect(200)
        .expect(res => expect(Array.isArray(res.body)).toBe(true)),
    );
  });

  describe('RFQs (authenticated)', () => {
    it('GET /api/v1/rfqs — should require auth', () =>
      request(app.getHttpServer()).get('/api/v1/rfqs').expect(401),
    );

    it('GET /api/v1/rfqs — should return paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/rfqs')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page');
    });

    it('POST /api/v1/rfqs — should validate required fields', () =>
      request(app.getHttpServer())
        .post('/api/v1/rfqs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400),
    );
  });

  describe('Analytics', () => {
    it('GET /api/v1/analytics/dashboard — should return KPIs', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/analytics/dashboard')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(res.body).toHaveProperty('totalSavings');
      expect(res.body).toHaveProperty('activeSuppliers');
      expect(res.body).toHaveProperty('openRfqs');
    });

    it('GET /api/v1/analytics/supplier-ranking — should return array', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/analytics/supplier-ranking')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
