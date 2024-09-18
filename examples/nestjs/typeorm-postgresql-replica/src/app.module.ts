import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';
import { Profile } from './db/entities/profile.entity';
import {WalletSharing} from "./db/entities/wallet-sharing.entity";
import {WalletSharingLimit} from "./db/entities/wallet-sharing-limit.entity";
import {Wallet} from "./db/entities/wallet.entity";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'user',
      password: 'password',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
     // namingStrategy: new SnakeNamingStrategy()
    }),
    TypeOrmModule.forFeature([User, Profile, Wallet, WalletSharing, WalletSharingLimit]),

    TypeOrmModule.forRoot({
      name: "read",
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'user',
      password: 'password',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      // namingStrategy: new SnakeNamingStrategy()
    }),
    TypeOrmModule.forFeature([User, Profile, Wallet, WalletSharing, WalletSharingLimit], 'read'),
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
