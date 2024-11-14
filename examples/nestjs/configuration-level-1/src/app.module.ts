import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestController } from './test.controller';
import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot({
  envFilePath: [
    process.env.ENV_FILE_PATH, // HIGHEST PRIORITY
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env',
  ],
});
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConfig } from './db.config';
import { PaypalModule } from './paypal/paypal.module';

const notProductionControllers = [] as any[];

if (process.env.NODE_ENV !== 'PRODUCTION') {
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
