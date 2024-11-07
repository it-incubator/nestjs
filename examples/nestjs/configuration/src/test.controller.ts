import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class TestController {
  constructor(private readonly appService: AppService) {
    console.log('TestController: process.env.NAME: ' + process.env.NAME);
  }

  @Get()
  getHello() {
    return {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      HOMEBREW_REPOSITORY: process.env.HOMEBREW_REPOSITORY,
      NAME: process.env.NAME,
    };
  }
}
