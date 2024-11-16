import { Controller, Get, Post, Query } from '@nestjs/common';
import { User } from './db/entities/user.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Profile } from './db/entities/profile.entity';
import { Wallet } from './db/entities/wallet.entity';
import { WalletSharing } from './db/entities/wallet-sharing.entity';
import { WalletSharingLimit } from './db/entities/wallet-sharing-limit.entity';
import { ApiPagination } from './custom-decorators';
import { plainToInstance } from 'class-transformer';
import { UserViewModel } from './dto/dto';
import { ApiQuery } from '@nestjs/swagger';


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
                        currency: Math.random() > 0.5 ? 'USD' : 'EUR',
                        owner: user,
                        balance: j,
                        addedAt: new Date(Date.now() + j * oneDay)
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

    @Get('users-full-entities-with-wallets')
    @ApiPagination()
    async usersFullEntitiesWithWallets(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
    ) {
        const [users, total] = await this.usersRepo
          .createQueryBuilder('u')
          .leftJoinAndSelect('u.wallets', 'w')
          .select(['u.id','u.firstName', 'w.id', 'w.balance' ])
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


    @Get('users-full-entities-raw')
    @ApiPagination()
    async usersFullEntitiesRaw(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,

    ) {
        const users = await this.usersRepo
          .createQueryBuilder('u')
          .select(['id', 'first_name', 'last_name'])
          .skip((page - 1) * limit)
          .take(limit)
          .getRawMany();

        return users;
    }


    @Get('users-entities-raw-with-transformation')
    @ApiPagination()
    async usersEntitiesWithTransformation(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,

    ) {
        const users = await this.usersRepo
          .createQueryBuilder('u')
          .select(['id', 'first_name', 'last_name'])
          .skip((page - 1) * limit)
          .take(limit)
          .getRawMany();

        const transformedUsers = plainToInstance(UserViewModel, users, {
            excludeExtraneousValues: true,
        });

        return transformedUsers;
    }

    @Get('users-entities-raw-with-aliases')
    @ApiPagination()
    async usersEntitiesWithAliases(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,

    ) {
        const users = await this.usersRepo
          .createQueryBuilder('u')
          .select(['id', '"firstName"', '"lastName"'])
          .skip((page - 1) * limit)
          .take(limit)
          .getRawMany();

        return users;
    }

    @Get('users-entities-raw-with-filter')
    @ApiPagination()
    @ApiQuery({ name: 'firstName', required: false, type: String })
    async usersEntitiesWithFilter(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('firstName') firstName: string | null = null,
    //  @Query('sortBy') sortBy: string = 'id',
     // @Query('sortOrder') sortOrder: string = 'asc'

    ) {
        let userSelectQueryBuilder = this.usersRepo
          .createQueryBuilder('u')
          .select(['id', '"firstName"', '"lastName"'])

        if (firstName) {
            userSelectQueryBuilder.where('"firstName" like :firstName', {firstName: firstName})
        }

        userSelectQueryBuilder.skip((page - 1) * limit)
          .take(limit)

        const users = await userSelectQueryBuilder.getRawMany()
        const count = await userSelectQueryBuilder.getCount()
        return { users, count};
    }




    @Get('users-partially-entities')
    @ApiPagination()
    async usersPartiallyEntities(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const users = await this.usersRepo
            .createQueryBuilder('u')
            // перечисляем нужные колонки, которые хотим получить, обращаясь к алисасу 'u
            .select(['u.id', 'u.firstName', 'u.lastName'])
            // с точки зрения sql так корректно, но не получится спарсить результат в сущности
            //.select(['u.*'])
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        let total = 10;
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
            .select(['currency', 'added_at as "addedAt"', 'CAST(ROW_NUMBER() OVER (PARTITION BY w.owner_id ORDER BY w.added_at) as INT) AS walletNumber'])
            .getRawMany()
        return wallets;
    }

    @Get('wallets-with-owner-name')
    async walletsWithOwnerFirstName() {
        const wallets = await this.walletsRepo
            .createQueryBuilder('w')
            .leftJoin(User, 'u', 'u.id = w."ownerId"')
            .select(['u."firstName"', 'w."currency"', 'w."addedAt"'])
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


    @Get('users-with-wallets-jsonb_agg-with_default-emptyarray')
    @ApiPagination()
    async getWalletsWithOwner_jsonb_agg(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const wallets = await this.dataSource
            .createQueryBuilder(User, 'u')
            .select(['u.id', 'u."firstName"'])
            .addSelect(`COALESCE(
                jsonb_agg(
                       json_build_object('id', w.id, 'balance', w.balance, 'currency', w.currency)
                    ) FILTER (WHERE w.id IS NOT NULL),
                '[]')  
                as wallets`)
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


    @Get('two-top-users-with-3-top-wallets-and-count-of-usd-wallets-with-subquery-inside-select')
    async getTopUsersWith3TopWalletsAndCountOfUsdWallets() {
        const users = await this.usersRepo
            .createQueryBuilder('u')
            .select(['u.id', 'u.firstName'])
            .addSelect((qb1) => qb1
                .select(`jsonb_agg(json_build_object('wId', "threeTopWalletsPerUser".id, 'wTitle', "threeTopWalletsPerUser".title, 'wBalance', "threeTopWalletsPerUser".balance))`)
                .from((qb2) => qb2
                    .select('"innerW".*')
                    .from(Wallet, 'innerW')
                    .where(`"innerW".currency = 'USD' and "innerW"."ownerId" = u.id`, {currency: 'USD'})
                    .orderBy('"innerW".balance', 'DESC')
                    .limit(3), 'threeTopWalletsPerUser'
                )
            )
            .addSelect((qb) => qb
                .select(['count(*)'])
                .from(Wallet, 'w')
                .where(`w.currency = 'USD' and w."ownerId" = u.id`, {currency: 'USD'})
                )
            .orderBy('u.id', "ASC")
            .limit(2)
            .getRawMany();

        return users
    }

    @Get('two-top-users-with-3-top-wallets-and-count-of-usd-wallets-with-subquery-join')
    async getTopUsersWith3TopWalletsAndCountOfUsdWalletsSubQueryInsideJoin() {
        const users = await this.usersRepo
            .createQueryBuilder('u')
            .select(['u.*', '"walletsCounts".count'])
            .addSelect((qb1) => qb1
                .select(`jsonb_agg(json_build_object('wId', "threeTopWalletsPerUser".id, 'wTitle', "threeTopWalletsPerUser".title, 'wBalance', "threeTopWalletsPerUser".balance))`)
                .from((qb2) => qb2
                    .select('"innerW".*')
                    .from(Wallet, 'innerW')
                    .where(`"innerW".currency = 'USD' and "innerW"."ownerId" = u.id`, {currency: 'USD'})
                    .orderBy('"innerW".balance', 'DESC')
                    .limit(3), 'threeTopWalletsPerUser'
                )
            )
            .leftJoin((qb) => qb
                    .select(['count(*)', '"ownerId"'])
                    .from(Wallet, 'w')
                    .where(`w.currency = 'USD' `, {currency: 'USD'})
                    .groupBy('w.ownerId'),
                'walletsCounts', '"walletsCounts"."ownerId" = u.id')
            .orderBy('u.id', "ASC")
            .limit(2)
            .getRawMany();
        return users
    }

    @Get('two-top-users-with-3-top-wallets-and-count-of-usd-wallets-with-cte-subquery')
    async getTopUsersWith3TopWalletsAndCountOfUsdWalletsSubQueryInsideJoinWithCTESubquery() {

        const owner_sumQueryBuilder = this.walletsRepo
            .createQueryBuilder('w')
            .select([`sum("balance") as usd_sum`, `"ownerId"`])
            .where(`w.currency = 'USD'`)
            .groupBy('w."ownerId"');

        const top_3_wallets_queryBuilder = this.usersRepo
            .createQueryBuilder('u')
            .select('u.id as user_id')
            .addSelect(qb => qb
                .select(`jsonb_agg(json_build_object('w_id', w3.id, 'w_title', w3.title, 'w_balance', w3.balance))`)
                .from(qb => qb
                    .select('*')
                    .from(Wallet, 'w2')
                    .where(`w2."ownerId" = u."id" and w2.currency = 'USD'`)
                    .orderBy(`w2.balance`, 'DESC')
                    .limit(3), 'w3'
                ), 'top_wallets');


        const users = await this.usersRepo
            .createQueryBuilder('u')
            .addCommonTableExpression(owner_sumQueryBuilder, 'owner_sum')
            .addCommonTableExpression(top_3_wallets_queryBuilder, 'top_3_wallets')
            .select(['u.*', 'os.usd_sum as usd_wallets_balance', 't3w.top_wallets'])
            .leftJoin('owner_sum', 'os', 'u.id = os."ownerId"')
            .leftJoin('top_3_wallets', 't3w', 'u.id = t3w."user_id"')
            .orderBy('usd_wallets_balance', 'DESC', 'NULLS LAST')
            .limit(3)
            .getRawMany();
        return users
    }

}

