import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .delete('/testing/all-data');
  });

  afterAll(async () => {
    await app.close();
  });

  it('/create/user', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ login: 'testUser', email: 'test1@email.com' })
      .expect(201);

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        login: 'testUser',
        email: 'test1@email.com',
        isConfirmed: false,
      }),
    );

   const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
      expect(response.body).toHaveLength(1); // Ensure only one user exists
  });
});
