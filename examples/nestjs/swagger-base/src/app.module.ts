import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { DogsModule } from './dogs/dogs.module';

@Module({
  imports: [DogsModule],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
