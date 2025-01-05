import { Module } from '@nestjs/common';
import { DogsController } from './api/dogs.controller';
import { DogService } from './application/dog.service';

@Module({
  controllers: [DogsController],
  providers: [DogService],
})
export class DogsModule {}
