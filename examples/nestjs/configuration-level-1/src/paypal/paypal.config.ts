import { Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';
import { validateConfigWithMessage } from '../utils/validation.utility';

@Injectable()
export class PaypalConfig {
  @IsString({ message: 'Set value via ENV: PAYPAL_SECRET' })
  secret: string = process.env.PAYPAL_SECRET;
  constructor() {
    validateConfigWithMessage(this);
  }
}
