import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersConfig } from './config/users.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersConfig],
  controllers: [UsersController],
  exports: [MongooseModule],
})
export class UsersModule {}
