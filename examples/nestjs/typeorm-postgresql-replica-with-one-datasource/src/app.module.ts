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
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      replication: {
        master: {
          host: 'localhost',
          port: 5433,
          username: 'user',
          password: 'password',
          database: 'postgres',
        },
        slaves: [
          {
            host: 'localhost',
            port: 5434,
            username: 'user',
            password: 'password',
            database: 'postgres',

          }
        ]
      }
    }),
    TypeOrmModule.forFeature([User, Profile, Wallet, WalletSharing, WalletSharingLimit]),
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
