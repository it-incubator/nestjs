import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {CourseController} from "./courses.controller";
import {CourseService} from "./courses.service";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 1000,
      limit: 1,
    }]),
  ],
  controllers: [AppController, CourseController],
  providers: [AppService, CourseService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
