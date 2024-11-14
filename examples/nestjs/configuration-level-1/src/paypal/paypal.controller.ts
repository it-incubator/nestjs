import { Controller, Get } from '@nestjs/common';

@Controller('paypal')
export class PaypalController {
  constructor() {}

  @Get()
  getPayments() {
    return [{ amount: 10, currency: 'usd' }];
  }
}
