import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig {
  skipPasswordCheck: boolean =
    this.configService.get('SKIP_PASSWORD_CHECK') === 'true';

  jwtSecret: string = this.configService.get('JWT_SECRET');

  constructor(private configService: ConfigService<any, true>) {}
}
