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
  paypalSecret: string;

  constructor(private configService: ConfigService<any, true>) {
    this.paypalSecret = this.configService.get('PAYMENT_PAYPAL_SECRET');

    configValidationUtility.validateConfig(this);
  }
}
