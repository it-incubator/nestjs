import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {DbModule} from "./db/db.module";


@Module({
  imports: [
    DbModule
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
