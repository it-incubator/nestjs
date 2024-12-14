import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreGlobalConfig {
  accessTokenSecret() {
    return 'access-token-secret-xxx';
  }
}
