import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Account } from './db/account.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(Account) private usersRepo: Repository<Account>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  async getAll(): Promise<Account[]> {
    return this.usersRepo.find();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Account> {
    return this.usersRepo.findOneBy({
      id: Number(id),
    });
  }

  @Post()
  create(@Body() body: Account) {
    this.usersRepo.save(body);

    // await this.usersRepo.insert(body);
  }
}
