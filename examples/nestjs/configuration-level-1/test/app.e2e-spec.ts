import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CoreConfig } from '../src/core/core.config';
import { NestFactory } from '@nestjs/core';
import { UsersConfig } from '../src/features/users/config/users.config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // смотри описание в main.ts почему мы именно так инициализируем приложение
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const coreConfig = appContext.get<CoreConfig>(CoreConfig);
    const DynamicAppModule = await AppModule.forRoot(coreConfig);

    await appContext.close();

    class TestUserConfig extends UsersConfig {
      isAutomaticallyConfirmed: boolean = true;
    }

    const moduleFixture = await Test.createTestingModule({
      imports: [DynamicAppModule],
    })
      .overrideProvider(UsersConfig)
      .useClass(TestUserConfig)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
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
        isConfirmed: true,
      }),
    );

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toHaveLength(1); // Ensure only one user exists
  });
});
