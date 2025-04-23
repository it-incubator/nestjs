import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNumber } from 'class-validator';
import { configValidationUtility } from './config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable PORT, example: 3000',
    },
  )
  port: number;

  constructor(private configService: ConfigService<any, true>) {
    this.port = parseInt(this.configService.get('PORT'));

    configValidationUtility.validateConfig(this);
  }
}
