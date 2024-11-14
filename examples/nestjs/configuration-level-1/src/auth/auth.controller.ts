import { Controller, Get } from '@nestjs/common';
import { AuthConfigService } from './auth.config';

console.log('app.controller.ts process.env.NODE_ENV: ', process.env.NODE_ENV);

@Controller('auth')
export class AuthController {
  constructor(private readonly authConfig: AuthConfigService) {}

  @Get()
  getHello() {
    return {
      isAuthEnabled: this.authConfig.isAuthEnabled,
    };
  }
}
