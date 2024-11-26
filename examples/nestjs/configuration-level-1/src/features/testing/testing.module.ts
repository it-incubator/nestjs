import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [TestingController],
})
export class TestingModule {}
