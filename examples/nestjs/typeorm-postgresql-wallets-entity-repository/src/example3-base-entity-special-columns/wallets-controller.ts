import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../db/entities/wallet.entity';
import { InputWalletDto } from './dto';
import { User } from '../db/entities/user.entity';

@Controller('example3/wallets')
export class WalletsController {
    constructor(
        @InjectRepository(Wallet) private walletsRepo: Repository<Wallet>,
        @InjectRepository(User) private usersRepo: Repository<User>
    ) {
    }

    @Get()
    async getAllWallets(): Promise<Wallet[]> {
        return await this.walletsRepo.find({ relations: ['owner'] });
    }

    @Get(':id')
    async getWalletById(@Param('id') id: number): Promise<Wallet | undefined> {
        return await this.walletsRepo.findOne({ where: { id }, relations: ['owner'] });
    }

    @Post()
    async createWallet(@Body() createWalletDto: InputWalletDto): Promise<Wallet> {
        const wallet = this.walletsRepo.create(createWalletDto);
        wallet.owner = { id: createWalletDto.ownerId } as User;
        return await this.walletsRepo.save(wallet);
    }

    /**
     * Данный подход можно использовать, если зависимых сущностей (В нашем случае Кошельков) немного..
     * Если мы так будет работать
     * например с комментариями, при добавлении нового комментария, то для старых пользователей для добавления одноо единственного
     * комментария придётся загрузить например тысячи его уже существующих комментариев. Поэтому этот способ не применим для каждого
     * случая, где у нас массив зависимых сущностей.
     * @param createWalletDto
     */
    @Post('ddd-style')
    async createWalletInDDDStyle(@Body() createWalletDto: InputWalletDto): Promise<Wallet> {
        // добавить кошелёк нужно, но мы будем действовать через User
        const userAggregate = await this.usersRepo.findOne({
            where: {
              id: createWalletDto.ownerId
            },
            relations: {
                wallets: true  //  ⁉️ чтобы это сработало, важно чтобы для юзера мы подтянули все его уже существующие кошельки.
                // Если мы этого не сделам, а потом создадим новый массив иположим туда один единственный только что созданный кошелёк,
                // ChangeDetection решит, что остальные кошльки нужно удалить, и он удалит их
            }
        });

        // User должен провалидировать создание кошелька и если всё ок, добавить к себе этот кошелёк
        const wallet = userAggregate.addNewWallet(createWalletDto)

        // далее сохраняем именно юзера, механизм ChangeDetection увидит, что в массиве появился новый кошелек
        // и выполнит команду Insert в БД

        await this.usersRepo.save(userAggregate);

        return wallet;
    }

    @Put(':id')
    async updateWallet(
      @Param('id') id: number,
      @Body() updateWalletDto: InputWalletDto
    ): Promise<Wallet | undefined> {
        const wallet = await this.walletsRepo.findOne({ where: { id } });
        if (!wallet) return undefined;

        Object.assign(wallet, updateWalletDto);
        await this.walletsRepo.save(wallet);

        return wallet;
    }

    @Delete(':id')
    async deleteWallet(@Param('id') id: string): Promise<void> {
        await this.walletsRepo.delete(id);
    }
}

