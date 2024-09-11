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
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Profile) private profilesRepo: Repository<Profile>,
        @InjectRepository(Wallet) private walletsRepo: Repository<Wallet>,
        @InjectRepository(WalletSharing) private walletSharingRepo: Repository<WalletSharing>,
        @InjectRepository(WalletSharingLimit) private accountRepo: Repository<WalletSharingLimit>,
        @InjectDataSource() private dataSource: DataSource,
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


    @Get('users-full-entities')
    @ApiPagination()
    async usersFullEntities(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const [users, total] = await this.usersRepo
            // так как билдер строим на основе сущности User, то и таблица будет users,
            // необходимо указать только alias 'u'
            .createQueryBuilder('u')
            // вместо limit и offset, используем skip и take, потому что в некоторых случаях они могут
            // более хитрый SQL запрос
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


    @Get('users-partially-entities')
    @ApiPagination()
    async usersPartiallyEntities(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const [users, total] = await this.usersRepo
            .createQueryBuilder('u')
            // перечисляем нужные колонки, которые хотим получить, обращаясь к алисасу 'u
            .select(['u.id', 'u.firstName', 'u.lastName'])
            // с точки зрения sql так корректно, но не получится спарсить результат в сущности
            //.select(['u.*'])
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    @Get('users-with-wallets')
    @ApiPagination()
    async getUsersWithWallets(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const [users, total] = await this.usersRepo
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.wallets', 'w')
            .skip((page - 1) * limit)
            .take(limit)
            // в этом случае пагинация будет работать некорректно, и будет пагинировать
            // не по юзерам, а по юзер + кошелек, а юзеров будет очень много, так как мноо кошельков у каждого юзера
            //.offset((page - 1) * limit)
            //.limit(limit)
            .getManyAndCount();

        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    @Get('wallets-with-row-number-by-owner-id')
    async walletsWithRowNumberByOwnerId() {
        const wallets = await this.walletsRepo
            .createQueryBuilder('w')
            .select(['w.*', 'CAST(ROW_NUMBER() OVER (PARTITION BY w."ownerId" ORDER BY w."addedAt") as INT) AS "walletNumber"'])
            .getRawMany()
        return wallets;
    }

    @Get('wallets-paginated-with-row-number-with-cte')
    async walletsPaginatedWithRowNumber() {
        const walletsWithRowsNumberBuilder = await this.walletsRepo
            .createQueryBuilder('w')
            .select(['w.*', 'ROW_NUMBER() OVER (ORDER BY w."addedAt") AS "walletNumber"']);

        const wallets = await this.dataSource
            .createQueryBuilder()
            .addCommonTableExpression(walletsWithRowsNumberBuilder, 'wallets_with_rows_number')
            .from('wallets_with_rows_number', 'wrn')
            .where('wrn."walletNumber" BETWEEN :from and :to', {from: 10, to: 20})
            .getRawMany();

        return wallets;
    }

    @Get('wallets-paginated-with-row-number-with-subquery')
    async walletsPaginatedWithRowNumberWithSubquery() {
        let walletsWithNumbersQueryBuilderFactory = (subQueryBuilder: SelectQueryBuilder<Wallet>) => subQueryBuilder
            .select(['w.*', 'ROW_NUMBER() OVER (ORDER BY w."addedAt") AS "walletNumber"'])
            .from(Wallet, 'w');

        const wallets = await this.dataSource
            .createQueryBuilder()
            .from(walletsWithNumbersQueryBuilderFactory,
                'wrn')
            .where('wrn."walletNumber" BETWEEN 10 and 20')
            .getRawMany();

        return wallets;
    }




    @Get('users-with-wallets-with-cte')
    @ApiPagination()
    async getUsersWithWalletsWithCTE(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        let userSelectQueryBuilder = this.usersRepo
            .createQueryBuilder('u');

        const total = await userSelectQueryBuilder.getCount()

        const paginatedUsersQueryBuilder = userSelectQueryBuilder
            // без алиаса колонки может быть ошибка в .where
            //.select('u.id')
            .select('u.id', 'paginatedUserId')
            .orderBy('u.lastName', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);

        // for getManyAndCount
        // const [users, total] = await this.usersRepo
        const users = await this.usersRepo
            .createQueryBuilder('u')
            .addCommonTableExpression(paginatedUsersQueryBuilder, 'paginated_users')
            .leftJoinAndSelect('u.wallets', 'w')
            .where(`u.id IN (SELECT "paginatedUserId" FROM "paginated_users")`)
            .getMany();
        // некорректно будет возврат кол-ва
        //.getManyAndCount();


        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    @Get('wallets-with-owner')
    @ApiPagination()
    async getWalletsWithOwner(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const wallets = await this.dataSource
            .createQueryBuilder(Wallet, 'w')
            .leftJoinAndSelect('w.owner', 'u')
            .getMany();

        return {
            data: wallets,
            page,
            limit
        };
    }


    @Get('wallets-with-owner-json_build_object')
    @ApiPagination()
    async getWalletsWithOwner_json_build_object(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const wallets = await this.dataSource
            .createQueryBuilder(Wallet, 'w')
            .select(['w.*', `json_build_object('firstName', u.firstName) as owner`])
            .leftJoin('w.owner', 'u')
            .getRawMany();
            // не будет работать
            //.getMany();

        return {
            data: wallets,
            page,
            limit,
        };
    }


    @Get('users-with-wallets-jsonb_agg')
    @ApiPagination()
    async getWalletsWithOwner_jsonb_agg(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const wallets = await this.dataSource
            .createQueryBuilder(User, 'u')
            .select(['u.*', `jsonb_agg(json_build_object('balance', w.balance, 'currency', w.currency)) as owner`])
            .leftJoin('u.wallets', 'w')
            .groupBy('u.id')
            .getRawMany();
            //.getMany();

        return {
            data: wallets,
            page,
            limit,
        };
    }




    @Get('users-with-wallets-count')
    @ApiPagination()
    async getUsersWithWalletsCount(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const users = await this.usersRepo
            .createQueryBuilder('u')
            .select(['u.*', 'count(1) as "walletsCount"'])
            .leftJoin('u.wallets', 'w')
            .groupBy('u.id')
            .getRawMany();

        return {
            data: users,
            page,
            limit,
        };
    }


    @Get('users-with-wallets-count-with-subquery')
    @ApiPagination()
    async getUsersWithWalletsCountWithSubQuery(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        let ownerIdsWithWalletsCounts = (sq: SelectQueryBuilder<Wallet>) => sq.select(['w.ownerId', 'count(1) as count'])
            .from(Wallet, 'w')
            .groupBy('w.ownerId');

        const users = await this.usersRepo
            .createQueryBuilder('u')
            .select(['u.*', '"walletsCounts".count'])
            .leftJoin(ownerIdsWithWalletsCounts,
                    'walletsCounts',
                    '"walletsCounts"."ownerId" = u."id"')
            .getRawMany();

        return {
            data: users,
            page,
            limit,
        };
    }

    @Get('users-with-wallets-count-with-subquery-cte')
    @ApiPagination()
    async getUsersWithWalletsCountWithSubQueryWIthCTE(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        let ownerIdsWithWalletsCounts = this.walletsRepo
            .createQueryBuilder('w')
            .select(['w.ownerId', 'count(1) as count'])
            .groupBy('w.ownerId');

        const users = await this.usersRepo
            .createQueryBuilder('u')
            .select(['u.*', '"walletsCounts".count'])
            .addCommonTableExpression(ownerIdsWithWalletsCounts, 'walletsCounts')
            .leftJoin('walletsCounts',
                'walletsCounts',
                '"walletsCounts"."ownerId" = u."id"')
            .getRawMany();

        return {
            data: users,
            page,
            limit,
        };
    }


    @Get('users-with-top-wallets')
    @ApiPagination()
    async getUsersWithTopWallets2(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const users = await this.dataSource
            .createQueryBuilder()
            .select(['u.*', 'wcount."walletCount"', 'w.*'])
            .from(subQuery => {
                return subQuery
                    .select('*')
                    .from(User, 'u')
                    .offset((page - 1) * limit)
                    .limit(limit);
            }, 'u')
            .leftJoinAndMapMany(
                'u.wallets',
                subQuery => subQuery
                    .select(['w.*', 'ROW_NUMBER() OVER (PARTITION BY w."ownerId" ORDER BY w."balance" DESC) as rank'])
                    .from(Wallet, 'w'),
                'w',
                'w."ownerId" = u."id" AND w.rank <= 2'
            )
            .leftJoin((sq) => sq
                    .select(['w.ownerId as "ownerId", COUNT(*) AS "walletCount"'])
                    .from(Wallet, 'w')
                    .groupBy('w.ownerId'),
                'wcount',
                'u.id = wcount."ownerId"'
            )
            .getRawMany();

        return {
            data: users,
            // total,
            page,
            limit,
            //  totalPages: Math.ceil(total / limit),
        };
    }


}

