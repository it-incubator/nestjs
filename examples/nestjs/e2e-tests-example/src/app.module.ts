import { configModule } from './dynamic-config-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

console.log('process.env.MONGODB_URI: ', process.env.MONGODB_URI);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    OrdersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
