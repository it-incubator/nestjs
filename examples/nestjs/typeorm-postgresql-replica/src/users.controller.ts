import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {User} from './db/entities/user.entity';
import {DataSource, Repository, SelectQueryBuilder} from 'typeorm';
import {InjectDataSource, InjectRepository} from '@nestjs/typeorm';
import {Profile} from './db/entities/profile.entity';
import {Wallet} from "./db/entities/wallet.entity";
import {WalletSharing} from "./db/entities/wallet-sharing.entity";
import {WalletSharingLimit} from "./db/entities/wallet-sharing-limit.entity";
import {ApiPagination} from "./custom-decorators";

@Controller('users')
export class UsersController {
    constructor(
        @InjectRepository(User, ) private usersRepo: Repository<User>,
        @InjectRepository(Profile, ) private profilesRepo: Repository<Profile>,
        @InjectRepository(Wallet, ) private walletsRepo: Repository<Wallet>,
        @InjectRepository(WalletSharing, ) private walletSharingRepo: Repository<WalletSharing>,
        @InjectRepository(WalletSharingLimit, ) private accountRepo: Repository<WalletSharingLimit>,
        @InjectDataSource() private dataSource: DataSource,
        @InjectRepository(User, 'read') private usersSecondaryReplicaRepo: Repository<User>,
    ) {
    }

    @Post('seed')
    async seed() {
        const queryRunner = this.dataSource.createQueryRunner();

        // Start transaction
        await queryRunner.startTransaction();

        try {
            // Delete all existing data
            await this.accountRepo.delete({});
            await this.walletSharingRepo.delete({});
            await this.walletsRepo.delete({});
            await this.profilesRepo.delete({});
            await this.usersRepo.delete({});

            // Seed data
            for (let i = 1; i <= 20; i++) {
                const user = await this.usersRepo.save({
                    firstName: `User${i}`,
                    lastName: `LastName${i}`,
                    passportNumber: `Passport${i}`,
                    isMarried: i % 2 === 0,
                });

                await this.profilesRepo.save({
                    userId: user.id,
                    hobby: `Hobby${i}`,
                    education: `Education${i}`,
                });

                const oneDay = 86400000; // 24 * 60 * 60 * 1000 milliseconds



                for (let j = 1; j <= 20 - i; j++) {
                    const wallet = await this.walletsRepo.save({
                        title: `Wallet${j} of User${i}`,
                        currency: Math.random() > 0.5 ? 'USD': 'EUR',
                        owner: user,
                        balance: j,
                        addedAt:  new Date(Date.now() + j * oneDay)
                    });

                    for (let k = 1; k <= 5; k++) {
                        const walletSharing = await this.walletSharingRepo.save({
                            wallet: wallet,
                            user: user,
                            addedDate: new Date(),
                            status: k % 2 === 0 ? 1 : 0,
                        });

                        await this.accountRepo.save({
                            walletSharingId: walletSharing.id,
                            limitPerDay: 100 * k,
                            limitPerWeek: 500 * k,
                            limitPerMonth: 2000 * k,
                        });
                    }
                }
            }

            // Commit transaction
            await queryRunner.commitTransaction();

            return {message: 'Seed data inserted successfully'};
        } catch (err) {
            // Rollback transaction in case of error
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }


    @Get('read-from-secondary-replica')
    @ApiPagination()
    async usersFullEntities(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const [users, total] = await this.usersSecondaryReplicaRepo
            // так как билдер строим на основе сущности User, то и таблица будет users,
            // необходимо указать только alias 'u'
            .createQueryBuilder('u')
            // вместо limit и offset, используем skip и take, потому что в некоторых случаях они могут
            // более хитрый SQL запрос
            .orderBy('u.id', 'ASC' )
            .skip((page - 1) * limit)
            .take(limit)
            // эта функция сделат 2 запроса, первый - получит все данные, второй - общее кол-во
            .getManyAndCount();

        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }





}

