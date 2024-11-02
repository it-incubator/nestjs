import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule.register(() => false)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
