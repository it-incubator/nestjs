import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./db/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5532,
      username: "dimych",
      password: "it-incubator.io",
      database: "example_db",
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
