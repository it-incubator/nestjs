import { Injectable } from '@nestjs/common';
import { PaypalConfig } from './paypal.config';

@Injectable()
export class PaypalService {
  constructor(private paypalConfig: PaypalConfig) {}
  makePayment() {
    const secret = this.paypalConfig.secret;
    console.log(secret);
    // httpRequest with secret
  }
}
