import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { configValidationUtility } from './config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  @IsNumber({}, {
    message: 'Set Env variable PORT, example: 3000',
  })
  port: number;

  @IsNotEmpty({
    message:
        'Set Env variable MONGO_URI, example: mongodb://localhost:27017/my-app-local-db',
  })
  mongoURI: string;

  @IsEnum(Environments, {
    message:
        'Set correct NODE_ENV value, available values: ' +
        configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: string;

  @IsBoolean({
    message:
        'Set Env variable IS_SWAGGER_ENABLED to enable/disable Swagger, example: true, available values: true, false',
  })
  isSwaggerEnabled: boolean;

  @IsBoolean({
    message:
        'Set Env variable INCLUDE_TESTING_MODULE to enable/disable Dangerous for production TestingModule, example: true, available values: true, false, 0, 1',
  })
  includeTestingModule: boolean;

  constructor(private configService: ConfigService<any, true>) {
    this.port = parseInt(this.configService.get('PORT'));
    this.mongoURI = this.configService.get('MONGO_URI');
    this.env = this.configService.get('NODE_ENV');
    this.isSwaggerEnabled = configValidationUtility.convertToBoolean(
        this.configService.get('IS_SWAGGER_ENABLED'),
    ) as boolean;
    this.includeTestingModule = configValidationUtility.convertToBoolean(
        this.configService.get('INCLUDE_TESTING_MODULE'),
    ) as boolean;

    configValidationUtility.validateConfig(this);
  }
}
