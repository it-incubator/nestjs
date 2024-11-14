import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor() {}

  @Get()
  getHello() {
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
