import { Controller, Get } from '@nestjs/common';
import { AppConfig } from './app.config';
import { getConfigurationAsync } from './config/get-configuration';
import { getSettingsAsync } from './config/get-settings-async';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from './env.config';

console.log('app.controller.ts process.env.NODE_ENV: ', process.env.NODE_ENV);

@Controller(process.env.NODE_ENV !== 'production' ? 'app' : '')
export class AppController {
  constructor(
    private configService: ConfigService,
    private appConfig: AppConfig,
    private envConfig: EnvironmentConfig,
  ) {
    console.log('AppController: process.env.NAME: ' + process.env.NAME);
  }

  @Get('raw-process-env')
  rawProcessEnv() {
    return {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      HOMEBREW_REPOSITORY: process.env.HOMEBREW_REPOSITORY,
      NAME: process.env.NAME,
    };
  }

  @Get('raw-process-env-via-get-config')
  async rawProcessEnvViaGetConfiguration() {
    const config = await getConfigurationAsync();
    return config;
  }

  @Get('raw-settings')
  async getRawSettings() {
    const settings = await getSettingsAsync();
    return settings;
  }

  @Get('all-via-config-service')
  async getAllViaConfigService() {
    const result = {
      PORT: await this.configService.get('PORT'),
      payments: await this.configService.get('payments'),
      WHO_WIN: await this.configService.get('WHO_WIN'), // return value from Env if exists
    };
    return result;
  }

  @Get('all-via-custom-services')
  async getAllViaCustomServices() {
    const result = {
      port: this.appConfig.port,
      mongoURL: this.appConfig.mongoURL,
      envConfig: this.envConfig.currentEnv,
    };
    return result;
  }
}
