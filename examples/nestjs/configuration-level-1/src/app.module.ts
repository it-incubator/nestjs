import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestController } from './test.controller';
import { ConfigModule } from '@nestjs/config';

console.log('before: ', process.env.DB_USER);

// should be before all other
const configModule = ConfigModule.forRoot({
  envFilePath: [
    `.env.testing.local`,
    `.env.testing`,
    '.env.production',
  ],
  isGlobal: true,
});

const configModule2 = ConfigModule.forRoot({
  envFilePath: [
    process.env.ENV_FILE_PATH?.trim(), // HIGHEST PRIORITY в сравнении с дургими файлами ниже, Помимо trim нужно быть оатсорожным спрокижыванием путя в стиле винды. лучше прокидывать со слэшем /
    `.env.${process.env.NODE_ENV}.local`, // in gitignore for local development  only or for local testing if want other settings
    `.env.${process.env.NODE_ENV}`, // for staging/development/testing (for testing in CICD env stronger)
    '.env.production',
  ],
  isGlobal: true,
});

console.log('after: ', process.env.DB_USER);

import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConfig } from './db.config';
import { PaypalModule } from './paypal/paypal.module';

const notProductionControllers = [] as any[];

if (process.env.NODE_ENV !== 'production') {
  notProductionControllers.push(TestController);
}

console.log('app.module.ts NODE_ENV: ' + process.env.NODE_ENV);
console.log('app.module.ts PORT: ' + process.env.PORT);
console.log('ENV_FILE_PATH: ', process.env.ENV_FILE_PATH);
console.log('mongoURL outside nestjs flow', process.env.MONGO_URL);

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (dbConfig: DbConfig) => {
        const uri = dbConfig.mongoURL;
        console.log('mongoURL inside useFactory', uri);
        return {
          uri: uri,
        };
      },
      inject: [DbConfig],
    }),
    configModule,
    AuthModule,
    PaypalModule,
  ],
  controllers: [AppController, ...notProductionControllers],
  providers: [DbConfig],
  exports: [DbConfig],
})
export class AppModule {}
