// import of this config module must be on the top of imports
import { configModule } from './config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './features/testing/testing.module';
import { PaymentModule } from './features/payment/payment.module';
import { UsersModule } from './features/users/users.module';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';

console.log('process.env.MONGO_URI: ', process.env.MONGO_URI);

const testingModule = [];
if (process.env.NODE_ENV === 'testing') {
  testingModule.push(TestingModule);
}

@Module({
  imports: [
    CoreModule,
    ...testingModule,
    PaymentModule,
    UsersModule,
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          uri: coreConfig.mongoURI,
        };
      },
      inject: [CoreConfig],
    }),
    configModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
