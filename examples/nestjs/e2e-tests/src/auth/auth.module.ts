import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './application/users/users.service';
import { UsersController } from './api/users/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './api/auth/auth.controller';
import { AuthConfig } from './config/auth.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [AuthModule],
      inject: [AuthConfig],
      useFactory: async (authConfig: AuthConfig) => ({
        secret: authConfig.jwtSecret,
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [UsersService, AuthConfig],
  controllers: [UsersController, AuthController],
  exports: [MongooseModule, JwtModule, AuthConfig],
})
export class AuthModule {}
