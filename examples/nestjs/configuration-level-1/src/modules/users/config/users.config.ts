import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean } from 'class-validator';
import { configValidationUtility } from '../../../core/config-validation.utility';

@Injectable()
export class UsersConfig {
  @IsBoolean({
    message: 'Set Env variable IS_USER_AUTOMATICALLY_CONFIRMED, example: false',
  })
  isAutomaticallyConfirmed: boolean;

  constructor(private configService: ConfigService<any, true>) {
    this.isAutomaticallyConfirmed = configValidationUtility.convertToBoolean(
        this.configService.get('IS_USER_AUTOMATICALLY_CONFIRMED'),
    ) as boolean;

    configValidationUtility.validateConfig(this);
  }
}
