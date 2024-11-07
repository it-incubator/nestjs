import { Controller, Get } from '@nestjs/common';
import { ClientBuyProductTwiceButPayOne } from './usecases/1/01-client-buy-product-twice-but-pay-one';

@Controller()
export class AppController {
  constructor(private readonly useCase: ClientBuyProductTwiceButPayOne) {}

  @Get()
  getHello() {
    return this.useCase.execute();
  }
}
