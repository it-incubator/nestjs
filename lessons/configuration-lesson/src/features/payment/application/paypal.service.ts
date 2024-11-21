import { Injectable } from '@nestjs/common';

@Injectable()
export class PaypalService {
  constructor() {}
  makePayment() {
    const secret = 'sdf348j09jcsds34ffe';
    console.log('payment DONE with secret: ' + secret);
  }
}
