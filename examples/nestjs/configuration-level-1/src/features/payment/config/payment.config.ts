import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../core/config-validation.utility';

@Injectable()
export class PaymentConfig {
  @IsNotEmpty({
    message:
      'Set Env variable PAYMENT_PAYPAL_SECRET, you can take it in Paypal Shop Control Panel',
  })
  paypalSecret: string = this.configService.get('PAYMENT_PAYPAL_SECRET');

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
