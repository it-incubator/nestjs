// import of this config module must be on the top of imports
import { configModule } from './config';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './features/testing/testing.module';
import { PaymentModule } from './features/payment/payment.module';
import { UsersModule } from './features/users/users.module';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';

@Module({
  imports: [
    CoreModule,
    PaymentModule,
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [CoreModule],
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
export class AppModule {
  static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
    const testingModule = [];
    if (coreConfig.includeTestingModule) {
      testingModule.push(TestingModule);
    }

    return {
      module: AppModule,
      imports: testingModule, // Add dynamic modules here
    };
  }
}
