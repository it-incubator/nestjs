import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/api/cats.controller';
import { DogsModule } from './dogs/dogs.module';
import { CatService } from './cats/application/cat.service';

@Module({
  imports: [DogsModule],
  controllers: [AppController, CatsController],
  providers: [AppService, CatService],
})
export class AppModule {}
