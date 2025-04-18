import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../auth/entities/user.entity';
import { OrdersService } from './application/orders/orders.service';
import { OrdersController } from './api/orders/orders.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [MongooseModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
