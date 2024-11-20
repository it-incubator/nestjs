import { Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';
import { validateConfig } from '../utils/validation.utility';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalConfig {
  @IsString({ message: 'Set value via ENV: PAYPAL_SECRET' })
  secret: string = this.configService.get('PAYPAL_SECRET'); // MUST NO DEFAULT!!!!
  constructor(protected configService: ConfigService) {
    validateConfig(this);
  }
}
