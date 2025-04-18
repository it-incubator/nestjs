import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initApp } from '../helpers/helper';
import { UsersTestHelper } from '../helpers/users.test-helper';
import { OrdersTestHelper } from './orders.test-helper';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  let createdUserId: string;
  let createdUserAccessToken: string;
  let ordersTestHelper: OrdersTestHelper;

  beforeAll(async () => {
    app = await initApp();

    const usersTestHelper = new UsersTestHelper(app);
    ordersTestHelper = new OrdersTestHelper(app);

    // Create a user for testing
    const userResponse = await usersTestHelper.createMainTestUser();

    createdUserId = userResponse.body._id;

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '123' })
      .expect(200);

    createdUserAccessToken = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it("/orders (POST) shouldn't create an order with userId because incorrect order date", async () => {
    await ordersTestHelper.createOrder(
      {
        orderId: '123',
        product: 'Product A',
        userId: createdUserId,
        orderDate: 'incorrect date',
      },
      {
        expectedStatusCode: 400,
      },
    );
  });

  it('/orders (POST) should create an order with userId', async () => {
    const response = await ordersTestHelper.createOrder({
      orderId: '123',
      product: 'Product A',
      userId: createdUserId,
      orderDate: new Date().toISOString(),
    });

    expect(response.body).toHaveProperty('_id');
    expect(response.body.userId).toBe(createdUserId);
  });

  it('/orders (GET) should retrieve all orders', async () => {
    const response = await request(app.getHttpServer()).get('/orders');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0].userId).toBe(createdUserId);
  });

  it('/orders/:id (GET) should retrieve an order by id', async () => {
    const orderResponse = await ordersTestHelper.createOrder({
      orderId: '456',
      product: 'Product B',
      userId: createdUserId,
      orderDate: new Date().toISOString(),
    });

    const orderId = orderResponse.body._id;

    const response = await request(app.getHttpServer()).get(
      `/orders/${orderId}`,
    );
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(orderId);
    expect(response.body.userId).toBe(createdUserId);
  });

  it('/orders/:id (PATCH) should update an order', async () => {
    const orderResponse = await ordersTestHelper.createOrder({
      orderId: '789',
      product: 'Product C',
      orderDate: new Date().toISOString(),
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

  it('/orders/:id (DELETE) should delete an order', async () => {
    const orderResponse = await ordersTestHelper.createOrder({
      orderId: '101112',
      product: 'Product D',
      userId: createdUserId,
      orderDate: new Date().toISOString(),
    });

    const orderId = orderResponse.body._id;
    const deleteResponse = await request(app.getHttpServer()).delete(
      `/orders/${orderId}`,
    );
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body._id).toBe(orderId);

    const getOrderByIdResponse = await request(app.getHttpServer()).get(
      `/orders/${orderId}`,
    );
    expect(getOrderByIdResponse.status).toBe(404);
  });

  it('/orders/:id (PATCH) should return 400 when sending invalid data', async () => {
    const orderResponse = await ordersTestHelper.createOrder({
      orderId: '999',
      product: 'Invalid Order',
      userId: createdUserId,
      orderDate: new Date().toISOString(),
    });

    const orderId = orderResponse.body._id;

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${createdUserAccessToken}`)
      .send({ orderDate: 'invalid-date' }) // Некорректный формат даты
      .expect(400);
  });
});
