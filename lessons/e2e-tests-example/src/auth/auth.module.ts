import { Module } from '@nestjs/common';
import { AuthController } from './api/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './api/users/users.controller';
import { UsersService } from './application/users/users.service';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'your_secret_key', // Используйте переменную окружения
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService],
  exports: [JwtModule, MongooseModule], // Реэкспорт JwtModule
})
export class AuthModule {}
