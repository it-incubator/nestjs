import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

console.log('app.controller.ts process.env.NODE_ENV: ', process.env.NODE_ENV);

@Controller(process.env.NODE_ENV !== 'production' ? 'app' : '')
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('AppController: process.env.NAME: ' + process.env.NAME);
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
