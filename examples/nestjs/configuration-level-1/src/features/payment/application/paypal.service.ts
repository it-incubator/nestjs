import { Injectable } from '@nestjs/common';
import { PaymentConfig } from '../config/payment.config';

@Injectable()
export class PaypalService {
  constructor(private paymentConfig: PaymentConfig) {}
  makePayment() {
    const secret = this.paymentConfig.paypalSecret;
    console.log('payment DONE with secret: ' + secret);
  }
}
