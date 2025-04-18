import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { AuthConfig } from '../../src/auth/config/auth.config';
// @ts-expect-error: jsonwebtoken неявно инсталлится вместе с "@nestjs/jwt"
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../../src/config/setup-app';
import { initApp } from '../helpers/helper';
import { UsersTestHelper } from '../helpers/users.test-helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let testUserId: string;
  const TEST_JWT_SECRET = 'test_secret';

  const originalEnvBackup = { ...process.env };

  afterEach(() => {
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnvBackup)) {
        delete process.env[key]; // Remove newly added variables
      }
    });
    Object.assign(process.env, originalEnvBackup); // Restore original values
  });

  beforeAll(async () => {
    // process.env.JWT_SECRET = TEST_JWT_SECRET;

    // const { AppModule } = await import('../../src/app.module');
    app = await initApp((builder) => {
      // .overrideProvider('JWT_MODULE_OPTIONS')
      // .useValue({
      //   secret: TEST_JWT_SECRET,
      //   signOptions: { expiresIn: '15m' },
      // })
      builder.overrideProvider(AuthConfig).useValue({
        skipPasswordCheck: false,
        jwtSecret: TEST_JWT_SECRET,
      } as AuthConfig);
    });

    const usersTestHelper = new UsersTestHelper(app);

    const userResponse = await usersTestHelper.createMainTestUser();

    testUserId = userResponse.body._id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) should return accessToken', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '123' })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('/auth/login (POST) should return 401 for invalid password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'any_password' })
      .expect(401);
  });

  it('/auth/login (POST) should return 401 for invalid login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: '123' })
      .expect(200);

    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });

  it('/auth/login (POST) should return a valid JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '123' })
      .expect(200);

    const token = response.body.accessToken;
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, TEST_JWT_SECRET);
    expect(decoded).toHaveProperty('email', 'test@example.com');
    expect(decoded).toHaveProperty('id', testUserId);
  });
});
