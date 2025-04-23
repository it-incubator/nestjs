import { Controller, Get, Post } from '@nestjs/common';
import { PaypalService } from '../application/paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(
    protected paypalService: PaypalService
  ) {}

  @Post()
  createPayment() {
    return this.paypalService.makePayment();
  }
}