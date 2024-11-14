import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfigService {
  constructor() {}

  get isAuthEnabled(): boolean {
    return process.env.AUTH_ENABLED === 'true';
  }
}
