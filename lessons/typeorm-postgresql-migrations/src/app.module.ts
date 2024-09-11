import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';
import { Profile } from './db/entities/profile.entity';
import { Photo } from './db/entities/photo.entity';
import { Album } from './db/entities/album.entity';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './finance/finance.module';
import { options } from './db/options';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...options,
      autoLoadEntities: true,
    } as TypeOrmModuleOptions),
    TypeOrmModule.forFeature([User, Profile, Photo, Album]),
    AuthModule,
    FinanceModule,
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
