
// import of this config module must be on the top of imports
import { configModule } from './config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './features/testing/testing.module';
import { PaymentModule } from './features/payment/payment.module';
import { UsersModule } from './features/users/users.module';


@Module({
  imports: [
    TestingModule,
    PaymentModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    configModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
