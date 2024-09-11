import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Cat, CatSchema} from "./entities/cat.entity";
import {CatsService} from "./cat.service";

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://root:example@localhost:27017,localhost:27018,localhost:27019/nest?retryWrites=true&loadBalanced=false&replicaSet=rs0&authSource=admin&readPreference=nearest', {}),
      // MongooseModule.forRoot('mongodb://root:example@localhost:27018/nest?authSource=admin&directConnection=true', {}),

      MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])
  ],
  controllers: [AppController],
  providers: [AppService, CatsService],
})
export class AppModule {}
