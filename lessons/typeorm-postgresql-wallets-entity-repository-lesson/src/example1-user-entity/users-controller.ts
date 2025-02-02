import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { User, UserStatus } from "../db/entities/user.entity";
import { LessThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { InputUserDto } from "./dto";
import { Wallet } from "../db/entities/wallet.entity";

@Controller("users")
export class UsersController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Wallet) private walletsRepo: Repository<Wallet>,
  ) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    //return await this.usersRepo.findBy({});
    return await this.usersRepo.findBy({
      //dob: LessThan(new Date(2001, 0, 1))
    });
  }

  @Get(":id")
  async getUserById(@Param("id") id: number): Promise<User | undefined> {
    //const user = await this.usersRepo.findOne({where: { id: id }, relations: ["wallets"]});

    const user = await this.usersRepo.preload({ id: Number(id), firstName: "Jhohn Kage" });

    await this.usersRepo.save(user)

    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: InputUserDto): Promise<User> {
    //const userAggregateRoot = this.usersRepo.create();
    const userAggregateRoot = new User();

    //userAggregateRoot.id = 14;

    Object.assign(userAggregateRoot, createUserDto);

    userAggregateRoot.status = UserStatus.active;
    userAggregateRoot.wallets = [Wallet.create('default')]

    await this.usersRepo.save(userAggregateRoot);

    return userAggregateRoot;
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateUserDto: InputUserDto,
  ): Promise<User | undefined> {
    const user = await this.usersRepo.findOne({where: { id }
    //  , relations: ["wallets"]
    } );

    //user.firstName = updateUserDto.firstName;
    //user.dob = updateUserDto.dob;
    user.wallets = [Wallet.create('SUPERWALLET')]
    user.update(updateUserDto);

    await this.usersRepo.save(user);

    return user;
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: number): Promise<void> {
    await this.usersRepo.softDelete(id);
    // await this.usersRepo.restore(id);
  }

  @Post(":id/wallets")
  async createWallet(@Param("id") id: number): Promise<void> {
    const wallet = new Wallet();

    wallet.balance = 0;
    wallet.title = "FAMILY";

    //wallet.ownerId = 140;
    wallet.owner = { id: id } as User;

    await this.walletsRepo.save(wallet);
  }

  @Get(":id/wallets")
  async wallets(@Param("id") id: number): Promise<Wallet[]> {
    const wallets = await this.walletsRepo.find({
      where: {
        owner: {
          id: id,
        },
      },
      relations: ['owner']
    });

    return wallets;
  }


}


// class BlogsController {
//   createPost() {
//     const blog = this.blogRepo.getById(12);
//     blog.createPost();
//     this.blogRepo.save(blog);
//   }
// }