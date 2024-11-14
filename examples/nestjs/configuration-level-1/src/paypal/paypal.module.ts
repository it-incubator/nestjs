import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalConfig } from './paypal.config';
import { PaypalController } from './paypal.controller';

@Module({
  providers: [PaypalService, PaypalConfig],
  controllers: [PaypalController],
})
export class PaypalModule {}
