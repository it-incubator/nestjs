import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';
import { Profile } from './db/entities/profile.entity';
import { Photo } from './db/entities/photo.entity';
import { Album } from './db/entities/album.entity';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './finance/finance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'it-incubator.io',
      database: 'TypeOrmIndexesLesson',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Profile, Photo, Album]),
    AuthModule,
    FinanceModule,
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
