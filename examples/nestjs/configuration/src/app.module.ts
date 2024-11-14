import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppConfig } from './app.config';
import { TestController } from './test.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { getConfigurationAsync } from './config/get-configuration';
import { getSettingsAsync } from './config/get-settings-async';
import { EnvironmentConfig } from './env.config';

const notProducationControllers = [] as any[];

if (process.env.NODE_ENV !== 'production') {
  notProducationControllers.push(TestController);
}

console.log('app.module.ts PORT: ' + process.env.PORT);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env',
      ],
      ignoreEnvVars: true,
      load: [getSettingsAsync, getConfigurationAsync], // last more prioritized, but not stronger then env
    }),
    AuthModule,
  ],
  controllers: [AppController, ...notProducationControllers],
  providers: [AppConfig, EnvironmentConfig],
})
export class AppModule {}
