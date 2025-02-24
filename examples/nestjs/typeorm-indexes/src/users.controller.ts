import { Controller, Get } from "@nestjs/common";
import { User } from "./db/entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";

@Controller("users")
export class UsersController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersRepo.createQueryBuilder().take(20).skip(0).getMany();
  }
}
