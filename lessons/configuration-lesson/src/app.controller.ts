import { Controller, Get } from '@nestjs/common';
import { CoreConfig } from './core/core.config';

@Controller('app')
export class AppController {
  constructor(private appConfig: CoreConfig) {}

  @Get('env')
  async getEnv() {
    return {
      PORT: this.appConfig.port,
      MONGO_URI: this.appConfig.mongoURI,
    };
  }
}
