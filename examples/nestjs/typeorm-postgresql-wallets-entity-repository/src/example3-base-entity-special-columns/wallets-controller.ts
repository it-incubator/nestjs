import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../db/entities/wallet.entity';
import { InputWalletDto } from './dto';
import { User } from '../db/entities/user.entity';

@Controller('example3/wallets')
export class WalletsController {
    constructor(
        @InjectRepository(Wallet) private walletsRepo: Repository<Wallet>
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

