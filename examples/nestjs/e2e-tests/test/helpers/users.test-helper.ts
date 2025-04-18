import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Response } from 'supertest';

export class UsersTestHelper {
  constructor(private app: INestApplication) {}

  async createMainTestUser(): Promise<Response> {
    const userResponse = await request(this.app.getHttpServer())
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        isActive: true,
      })
      .expect(201);
    return userResponse;
  }
}
