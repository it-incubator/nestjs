import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';
import { Profile } from './db/entities/profile.entity';
import { WalletSharing } from './db/entities/wallet-sharing.entity';
import { WalletSharingLimit } from './db/entities/wallet-sharing-limit.entity';
import { Wallet } from './db/entities/wallet.entity';
import { Users2Controller } from './users2.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'it-incubator.io',
      database: 'BankSystemTypeOrmCamecase',
     // database: 'BankSystemTypeOrm', // snake_case
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
     // namingStrategy: new SnakeNamingStrategy()
    }),
    TypeOrmModule.forFeature([User, Profile, Wallet, WalletSharing, WalletSharingLimit]),
  ],
  controllers: [UsersController, Users2Controller],
  providers: [],
})
export class AppModule {}
