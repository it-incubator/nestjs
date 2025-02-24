import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./db/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5442,
      username: "postgres",
      password: "it-incubator.io",
      database: "TypeOrmIndexesLesson",
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
