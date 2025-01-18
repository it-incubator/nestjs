import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let createdUserId: string;
  let anotherUserId: string;
  let createdUserAccessToken: string;
  let anotherUserAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());

    const collections = await connection.db.listCollections().toArray();
    for (const collection of collections) {
      await connection.db.collection(collection.name).deleteMany({});
    }

    // Создание пользователей
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Test User', email: 'test@example.com', isActive: true });
    createdUserId = userResponse.body._id;

    const anotherUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Another User',
        email: 'another@example.com',
        isActive: true,
      });
    anotherUserId = anotherUserResponse.body._id;

    // Логинизация пользователей
    const createdUserLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    createdUserAccessToken = createdUserLoginResponse.body.accessToken;

    const anotherUserLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'another@example.com', password: 'password123' });
    anotherUserAccessToken = anotherUserLoginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/orders/:id (PATCH) should return 401 for unauthorized user', async () => {
    const orderResponse = await request(app.getHttpServer())
      .post('/orders')
      .send({
        orderId: '456',
        product: 'Product A',
        orderDate: new Date(),
        userId: createdUserId,
      });

    const orderId = orderResponse.body._id;
    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}`)
      .send({ product: 'Updated Unauthorized' });

    expect(response.status).toBe(401);
  });

  it("/orders/:id (PATCH) should return 403 for updating another user's order", async () => {
    const orderResponse = await request(app.getHttpServer())
      .post('/orders')
      .send({
        orderId: '789',
        product: 'Product B',
        orderDate: new Date(),
        userId: createdUserId,
      });

    const orderId = orderResponse.body._id;

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${anotherUserAccessToken}`)
      .send({ product: 'Updated Forbidden' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('You cannot update this order');
  });

  it('/orders/:id (PATCH) should update an order successfully', async () => {
    const orderResponse = await request(app.getHttpServer())
      .post('/orders')
      .send({
        orderId: '101112',
        product: 'Product C',
        orderDate: new Date(),
        userId: createdUserId,
      });

    const orderId = orderResponse.body._id;

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${createdUserAccessToken}`)
      .send({ product: 'Updated Product' });

    expect(response.status).toBe(200);
    expect(response.body.product).toBe('Updated Product');
  });
});
