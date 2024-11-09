import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InputUserDto } from './dto';
import { Profile } from '../db/entities/profile.entity';
import { Wallet } from '../db/entities/wallet.entity';

@Controller('users')
export class UsersController {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
         @InjectRepository(Profile) private profilesRepo: Repository<Profile>,
         @InjectRepository(Wallet) private walletsRepo: Repository<Wallet>,
        // @InjectRepository(WalletSharing) private walletSharingRepo: Repository<WalletSharing>,
        // @InjectRepository(WalletSharingLimit) private accountRepo: Repository<WalletSharingLimit>,
        // @InjectDataSource() private dataSource: DataSource,
    ) {
    }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return await this.usersRepo.find({
            withDeleted: true,
            relations: ["profile", "wallets"]
        });
    }

    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<User | undefined> {
        return await this.usersRepo.findOne({
            where: { id }
        });
    }

    @Post()
    async createUser(@Body() createUserDto: InputUserDto): Promise<User> {
        const userAggregate: User = User.create(createUserDto)
         await this.usersRepo.save(userAggregate);
          userAggregate.profile.user = userAggregate;
         // user.wallets.forEach(w => w.user = user)
         await this.profilesRepo.save(userAggregate.profile);
         await this.walletsRepo.save(userAggregate.wallets);
        return userAggregate;
    }

    @Put(':id')
    async updateUser(
      @Param('id') id: number,
      @Body() updateUserDto: InputUserDto
    ): Promise<User | undefined> {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user) return undefined;

        user.update(updateUserDto)

        await this.usersRepo.save(user);

        return user;
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<void> {
        await this.usersRepo.restore(id);
    }

    @Delete(':id/profile')
    async deleteUserProfile(@Param('id') id: number): Promise<void> {
        const user = await this.usersRepo.findOne({where: {id}, relations: {
            profile: true
            }});

        // user.profile = null;
        await this.usersRepo.save(user)
    }
}

