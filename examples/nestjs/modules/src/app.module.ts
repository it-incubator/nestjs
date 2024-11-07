import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule.registerAsync(async () => {
      return new Promise((res) => setTimeout(() => res(false), 1000));
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
