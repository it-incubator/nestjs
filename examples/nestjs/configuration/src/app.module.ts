import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test.controller';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from './config/get-configuration';
import { AuthModule } from './auth/auth.module';

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
      load: [getConfiguration],
    }),
    AuthModule,
  ],
  controllers: [AppController, ...notProducationControllers],
  providers: [AppService],
})
export class AppModule {}
