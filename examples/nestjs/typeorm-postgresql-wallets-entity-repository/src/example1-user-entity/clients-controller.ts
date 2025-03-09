import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Client } from "../db/entities/user.entity";
import {LessThan, Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { InputUserDto } from "./dto";
import { Profile } from "../db/entities/profile.entity";
import { Wallet } from "../db/entities/wallet.entity";

@Controller("clients")
export class ClientsController {
  constructor(
    @InjectRepository(Client) private clientsRepo: Repository<Client>,
    @InjectRepository(Profile) private profilesRepo: Repository<Profile>,
    @InjectRepository(Wallet) private walletsRepo: Repository<Wallet>,
  ) {}

  @Get()
  async getAllUsers(): Promise<Client[]> {
    return await this.clientsRepo.find({
      //withDeleted: true,
      //relations: ["profile", "wallets"]
    });
  }

  @Get(":id")
  async getUserById(@Param("id") id: number): Promise<Client | undefined> {
    return await this.clientsRepo.findOne({
      where: { id },
    });
  }

  @Post()
  async createUser(@Body() createUserDto: InputUserDto): Promise<void> {
    const userAggregateRoot: Client = Client.create(createUserDto);
    // с cascade: true мы можем создать только юзера, а все зависимые сущности в других таблицах создадутся автоматически
    await this.clientsRepo.save(userAggregateRoot);

    // с cascade: false мы должны с каждой сущностью работать по отдельности.
    // userAggregateRoot.profile.user = userAggregateRoot;
    // user.wallets.forEach(w => w.user = user)
    // await this.profilesRepo.save(userAggregateRoot.profile);
    // await this.walletsRepo.save(userAggregateRoot.wallets);
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateUserDto: InputUserDto,
  ): Promise<Client | undefined> {
    const client = await this.clientsRepo.findOne({
      where: { id },
      relations: ["profile", "wallets"],
    });

    // const wallets = await this.walletsRepo.find({
    //   where: {
    //     balance: LessThan(0),
    //     owner: {
    //       id: id,
    //     },
    //   },
    // });

    // if (wallets.length > 0) {
    //   throw Error('Client can go to vacation because has dept on ' + wallets[0].title);
    // }

    if (!client) return undefined;

    client.update(updateUserDto);

    await this.clientsRepo.save(client);

    return client;
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: number): Promise<void> {
    await this.clientsRepo.restore(id);
  }

  @Delete(":id/profile")
  async deleteUserProfile(@Param("id") id: number): Promise<void> {
    const user = await this.clientsRepo.findOne({
      where: { id },
      relations: {
        //profile: true
      },
    });

    // user.profile = null;
    await this.clientsRepo.save(user);
  }
}
