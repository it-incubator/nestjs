import { IsEnum } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  // 'production' данная переменная не допустима, так как isProduction будет работать не корректно
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

@Injectable()
export class EnvironmentConfig {
  constructor(private configService: ConfigService) {}

  @IsEnum(Environments)
  private ENV = this.configService.get('NODE_ENV');

  get isProduction() {
    return this.ENV === Environments.PRODUCTION;
  }
  get isStaging() {
    return this.ENV === Environments.STAGING;
  }
  get isTesting() {
    return this.ENV === Environments.TEST;
  }
  get isDevelopment() {
    return this.ENV === Environments.DEVELOPMENT;
  }
  get currentEnv() {
    return this.ENV;
  }
}
