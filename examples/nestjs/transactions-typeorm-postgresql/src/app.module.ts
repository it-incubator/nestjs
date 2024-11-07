import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Payment } from './entities/payment.entity';
import { Product } from './entities/product.entity';
import { AppController } from './app.controller';
import { getProviders } from './provider-registrator';

const providers = getProviders();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dimych',
      password: 'it-incubator.io',
      database: 'transactions_example',
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([Client, Payment, Product]),
  ],
  controllers: [AppController],
  providers: providers,
})
export class AppModule {}
