import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configFactory } from './config.factory';
import { AuthConfigService } from './auth.config';
import { AuthController } from './auth.controller';

@Module({
  imports: [ConfigModule.forFeature(configFactory)],
  providers: [AuthConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
