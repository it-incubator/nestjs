import { Module } from '@nestjs/common';
import { UsersController } from './example1-user-entity/users-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';
import { Profile } from './db/entities/profile.entity';
import { WalletSharing } from './db/entities/wallet-sharing.entity';
import { WalletSharingLimit } from './db/entities/wallet-sharing-limit.entity';
import { Wallet } from './db/entities/wallet.entity';
import { ProfilesController } from './example2-profile-entity/profiles-controller';
import { WalletsController } from './example3-base-entity-special-columns/wallets-controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dimych',
      password: 'it-incubator.io',
      database: 'example_db',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Profile, Wallet]),//, Profile, Wallet, WalletSharing, WalletSharingLimit]),
  ],
  controllers: [UsersController, ProfilesController],//, ProfilesController, WalletsController],
  providers: [],
})
export class AppModule {}
