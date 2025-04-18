import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Response } from 'supertest';
import { CreateOrderDTO } from '../../src/orders/dto/create-order.dto';

export class OrdersTestHelper {
  constructor(private app: INestApplication) {}

  async createOrder(
    createOrderDto: CreateOrderDTO,
    options?: {
      expectedStatusCode?: number;
    },
  ): Promise<Response> {
    const response = await request(this.app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(options?.expectedStatusCode ?? 201);
    return response;
  }
}
