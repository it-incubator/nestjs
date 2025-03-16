import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';
import { Profile } from './db/entities/profile.entity';
import { WalletSharing } from './db/entities/wallet-sharing.entity';
import { WalletSharingLimit } from './db/entities/wallet-sharing-limit.entity';
import {Wallet} from './db/entities/wallet.entity';
import {WalletView} from "./db/entities/wallet.view";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5532,
      username: 'dimych',
      password: 'it-incubator.io',
      database: 'query_builder',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      namingStrategy: new SnakeNamingStrategy()
    }),
    TypeOrmModule.forFeature([User, Profile, Wallet, WalletSharing, WalletSharingLimit, /*WalletView*/]),
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
