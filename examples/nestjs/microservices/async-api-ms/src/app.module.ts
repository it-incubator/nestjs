import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FelinesModule } from './felines/felines.module';

@Module({
  imports: [FelinesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
