import { Module } from '@nestjs/common';
import { PaypalService } from './application/paypal.service';
import { PaypalController } from './api/paypal.controller';
import { PaymentConfig } from './config/payment.config';

@Module({
  providers: [PaypalService, PaymentConfig],
  controllers: [PaypalController],
})
export class PaymentModule {}
