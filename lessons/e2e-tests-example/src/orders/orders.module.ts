import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { OrdersService } from './application/orders/orders.service';
import { OrdersController } from './api/orders/orders.controller';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  exports: [MongooseModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
