import { Module } from '@nestjs/common';
import { PaypalService } from './application/paypal.service';
import { PaypalController } from './api/paypal.controller';

@Module({
  providers: [PaypalService],
  controllers: [PaypalController],
})
export class PaymentModule {}
