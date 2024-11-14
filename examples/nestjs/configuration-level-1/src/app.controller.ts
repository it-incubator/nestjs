import { Controller, Get } from '@nestjs/common';

console.log('app.controller.ts process.env.NODE_ENV: ', process.env.NODE_ENV);

@Controller(process.env.NODE_ENV !== 'production' ? 'app' : '')
export class AppController {
  constructor() {
    console.log('AppController: process.env.NAME: ' + process.env.NAME);
  }

  @Get('raw-process-env')
  rawProcessEnv() {
    return {
      PORT: process.env.PORT,
      DB_USER: process.env.DB_USER,
      NODE_ENV: process.env.NODE_ENV,
      MONGO_URL: process.env.MONGO_URL,
      VALUE1: process.env.VALUE1,
      VALUE2: process.env.VALUE2,
      HOMEBREW_REPOSITORY: process.env.HOMEBREW_REPOSITORY,
    };
  }
}
