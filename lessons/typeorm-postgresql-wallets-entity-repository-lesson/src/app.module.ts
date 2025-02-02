import { Module } from "@nestjs/common";
import { UsersController } from "./example1-user-entity/users-controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./db/entities/user.entity";
import {Wallet} from "./db/entities/wallet.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "dimych",
      password: "it-incubator.io",
      database: "example_db",
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
