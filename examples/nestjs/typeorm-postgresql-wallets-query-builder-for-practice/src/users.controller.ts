import { Controller, Get, Post, Query } from "@nestjs/common";
import { User } from "./db/entities/user.entity";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Profile } from "./db/entities/profile.entity";
import { Wallet } from "./db/entities/wallet.entity";
import { WalletSharing } from "./db/entities/wallet-sharing.entity";
import { WalletSharingLimit } from "./db/entities/wallet-sharing-limit.entity";
import { ApiPagination } from "./custom-decorators";
import { plainToInstance } from "class-transformer";
import { UserViewModel } from "./dto/dto";
import { ApiQuery } from "@nestjs/swagger";
import { WalletView } from "./db/entities/wallet.view";

@Controller("users")
export class UsersController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Profile) private profilesRepo: Repository<Profile>,
    @InjectRepository(Wallet) private walletsRepo: Repository<Wallet>,
    // @InjectRepository(WalletView)
    // private walletsViewsRepo: Repository<WalletView>,
    @InjectRepository(WalletSharing)
    private walletSharingRepo: Repository<WalletSharing>,
    @InjectRepository(WalletSharingLimit)
    private accountRepo: Repository<WalletSharingLimit>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Post("seed")
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
            currency: Math.random() > 0.5 ? "USD" : "EUR",
            owner: user,
            balance: j,
            addedAt: new Date(Date.now() + j * oneDay),
            deletedAt: new Date(Date.now() + j * oneDay),
            lastTransactionAt: new Date(Date.now() + j * oneDay),
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

      return { message: "Seed data inserted successfully" };
    } catch (err) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  @Get("users-full-entities-raw")
  @ApiPagination()
  async usersFullEntitiesRaw(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select([
        'u.id as "id"',
        'u.firstName as "firstName"',
        'u.lastName as "lastName"',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return users;
  }

  @Get("users-entities-raw-with-filter")
  @ApiPagination()
  @ApiQuery({ name: "firstName", required: false, type: String })
  async usersEntitiesWithFilter(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("firstName") firstName: string | null = null,
    //  @Query('sortBy') sortBy: string = 'id',
    // @Query('sortOrder') sortOrder: string = 'asc'
  ) {
    let userSelectQueryBuilder = this.usersRepo
      .createQueryBuilder("u")
      .select([
        'u.id as "id"',
        'u.firstName as "firstName"',
        'u.lastName as "lastName"',
      ]);

    if (firstName) {
      userSelectQueryBuilder.where("u.firstName like :firstName", {
        firstName: `%${firstName}%`,
      });
    }

    userSelectQueryBuilder.skip((page - 1) * limit).take(limit);

    const users = await userSelectQueryBuilder.getMany();
    const count = await userSelectQueryBuilder.getCount();
    return { users, count };
  }

  @Get("wallets-with-row-number-by-owner-id")
  async walletsWithRowNumberByOwnerId() {
    const wallets = await this.walletsRepo
      .createQueryBuilder("w")
      .select([
        'w.currency as "currency"',
        'w.addedAt as "addedAt"',
        'w.owner.id as "ownerId"',
        'CAST(ROW_NUMBER() OVER (PARTITION BY w.owner.id ORDER BY w.addedAt) as INT) AS "walletNumber"',
      ])
      .where("w.owner.id = :ownerId", { ownerId: 21 })
      .getRawMany();
    return wallets;
  }

  @Get("wallets-with-owner-name-and-education")
  async walletsWithOwnerFirstName() {
    const wallets = await this.walletsRepo
      .createQueryBuilder("w")
      //.leftJoin(User, "u", 'u.id = w.owner.id')
      .leftJoin("w.owner", "u")
      .leftJoin("u.profile", "p")
      // .leftJoin('w.owner.profile', 'p') // ❌
      .select([
        'u.firstName as "ownerFirstName"',
        'p.education as "ownerEducation"',
        'w.currency as "currency"',
        'w.addedAt as "addedAt"',
      ])
      .getRawMany();
    return wallets;
  }

  @Get("wallets-paginated-with-row-number-with-cte")
  async walletsPaginatedWithRowNumber() {
    // мы не хотим возвращать row number
    const walletsWithRowsNumberBuilder = this.walletsRepo
      .createQueryBuilder("w")
      .select([
        "w.addedAt as wallet_added_at",
        "w.title as wallet_title",
        "ROW_NUMBER() OVER (ORDER BY w.addedAt) AS wallet_number",
      ]);

    const wallets = await this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(walletsWithRowsNumberBuilder, "wrn")
      .select([
        'wrn.wallet_added_at as "walletAt" ',
        'wrn.wallet_title as "title"',
      ])
      .from("wrn", "wrn")
      .where("wrn.wallet_number BETWEEN :from and :to", { from: 10, to: 20 })
      .getRawMany();

    return wallets;
  }

  @Get("wallets-paginated-with-row-number-with-subquery")
  async walletsPaginatedWithRowNumberWithSubquery() {
    let walletsWithNumbersQueryBuilderFactory = (
      subQueryBuilder: SelectQueryBuilder<Wallet>,
    ) => {
      subQueryBuilder
        .select([
          "w.title as wallet_title",
          "w.addedAt as added_at",
          "ROW_NUMBER() OVER (ORDER BY w.addedAt) AS wallet_number",
        ])
        .from(Wallet, "w");

      return subQueryBuilder;
    };

    const wallets = await this.dataSource
      .createQueryBuilder()
      .select(['wrn.wallet_title as "title"', 'wrn.added_at as "addedAt"'])
      .from(walletsWithNumbersQueryBuilderFactory, "wrn")
      .where("wrn.wallet_number BETWEEN 10 and 20")
      .getRawMany();

    return wallets;
  }

  @Get("users-with-wallets-with-cte")
  @ApiPagination()
  async getUsersWithWalletsWithCTE(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    // let userSelectQueryBuilder = this.usersRepo.createQueryBuilder("u"); // ✅
    let userSelectQueryBuilder = this.dataSource
      .createQueryBuilder()
      .from(User, "u"); // ✅

    const total = await userSelectQueryBuilder.getCount();

    const paginatedUsersQueryBuilder = userSelectQueryBuilder
      .select("u.id", "paginated_user_id")
      .orderBy("u.lastName", "ASC")
      .skip((page - 1) * limit)
      .take(limit);

    // for getManyAndCount
    // const [users, total] = await this.usersRepo
    const users = await this.usersRepo
      .createQueryBuilder("u")
      .addCommonTableExpression(paginatedUsersQueryBuilder, "paginated_users")
      .select("u.firstName", "firstName")
      .addSelect("u.id", "id")
      .addSelect("w.title", "walletTitle")
      .addSelect("w.id", "walletId")
      .leftJoin("u.wallets", "w")
      .where(`u.id IN (SELECT paginated_user_id FROM paginated_users)`)
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    const usersMap = new Map();

    users.forEach((user) => {
      if (!usersMap.has(user.id)) {
        usersMap.set(user.id, {
          firstName: user.firstName,
          id: user.id,
          wallets: [],
        });
      }
      usersMap
        .get(user.id)
        .wallets.push({ id: user.walletId, title: user.walletTitle });
    });

    // [{firstName: '', wallets: []},{firstName: '', wallets: []},{firstName: '', wallets: []},{firstName: '', wallets: []}]

    return {
      data: Array.from(usersMap.values()),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get("users-with-wallets-jsonb_agg-with_default-emptyarray")
  @ApiPagination()
  async getWalletsWithOwner_jsonb_agg(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const wallets = await this.dataSource
      .createQueryBuilder(User, "u")
      .select("u.id", "id")
      .addSelect("u.firstName", "firstName")
      .addSelect(
        `COALESCE(
                jsonb_agg(
                       json_build_object('id', w.id, 'balance', w.balance, 'currency', w.currency, 'addedAt', w.addedAt, 'deletedAt', w.deletedAt)
                    ) FILTER (WHERE w.id IS NOT NULL),
                '[]')`,
        "wallets",
      )
      .leftJoin("u.wallets", "w")
      .groupBy("u.id")
      .limit(limit)
      .getRawMany();

    return {
      data: wallets,
      page,
      limit,
    };
  }

  @Get("wallets-with-owner")
  @ApiPagination()
  async getWalletsWithOwner(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const walletsBuilder = this.dataSource
      .createQueryBuilder(Wallet, "w")
        .select('w.id', 'id')
        .addSelect('w.title', 'title')
        .addSelect('u.firstName', 'ownerFirstName')
        .leftJoin("w.owner", "u");

    const walletsPromise = walletsBuilder
        .getRawMany();

    const wallets = await walletsPromise;

    const formattedWallets = wallets.map(wallet => ({
      id: wallet.id,
      title: wallet.title,
      owner: {
        firstName: wallet.ownerFirstName
      }
    }));


    return {
      data: formattedWallets,
      page,
      limit,
    };
  }

  @Get("wallets-with-owner-json_build_object")
  @ApiPagination()
  async getWalletsWithOwner_json_build_object(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const wallets = await this.dataSource
      .createQueryBuilder(Wallet, "w")
        .select('w.id', 'id')
        .addSelect('w.title', 'title')
        .addSelect(`json_build_object('firstName', u.firstName) `, 'owner')
        .leftJoin("w.owner", "u")
        .getRawMany();

    return {
      data: wallets,
      page,
      limit,
    };
  }

  //

  @Get("users-with-wallets-count")
  @ApiPagination()
  async getUsersWithWalletsCount(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select(["u.*", 'count(1) as "walletsCount"'])
      .leftJoin("u.wallets", "w")
      .groupBy("u.id")
      .getRawMany();

    return {
      data: users,
      page,
      limit,
    };
  }

  // ✅
  @Get("users-with-wallets-count-with-subquery")
  @ApiPagination()
  async getUsersWithWalletsCountWithSubQuery(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    let ownerIdsWithWalletsCounts = (sq: SelectQueryBuilder<Wallet>) =>
      sq
        .select(['w.owner.id as "ownerId"', 'count(*) as "count"'])
        .from(Wallet, "w")
        .groupBy("w.owner.id");

    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select(['u.firstName as "clientFirstName"', '"walletsCounts".count'])
      .leftJoin(
        ownerIdsWithWalletsCounts,
        "walletsCounts",
        '"walletsCounts"."ownerId" = u.id',
      )
      .getRawMany();

    return {
      data: users,
      page,
      limit,
    };
  }

  @Get("users-with-wallets-count-with-subquery-cte")
  @ApiPagination()
  async getUsersWithWalletsCountWithSubQueryWIthCTE(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    let ownerIdsWithWalletsCounts = this.walletsRepo
      .createQueryBuilder("w")
      .select(["w.ownerId", "count(1) as count"])
      .groupBy("w.ownerId");

    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select(["u.*", '"walletsCounts".count'])
      .addCommonTableExpression(ownerIdsWithWalletsCounts, "walletsCounts")
      .leftJoin(
        "walletsCounts",
        "walletsCounts",
        '"walletsCounts"."ownerId" = u."id"',
      )
      .getRawMany();

    return {
      data: users,
      page,
      limit,
    };
  }

  // ✅
  @Get("users-with-top-wallets")
  @ApiPagination()
  async getUsersWithTopWallets2(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.dataSource
      .createQueryBuilder()
      .select(["_u.*", '_wcount."walletCount"', "_w.*"])
      .from((subQuery) => {
        return subQuery
          .select(['u.firstName as "clientFirstName"', 'u.id as "clientId"'])
          .from(User, "u")
          .offset((page - 1) * limit)
          .limit(limit);
      }, "_u")
      // используем это если не делаем агрегацию внутри БД
      .leftJoinAndMapMany(
        // засунем масив элементов в сво-во
        "u.wallets", // вот в это сво-во
        (subQuery) =>
          subQuery
            .select([
              'w.balance as "balance"',
              'w.owner.id as "ownerId"',
              'ROW_NUMBER() OVER (PARTITION BY w.owner.id ORDER BY w.balance DESC) as "rank"',
            ])
            .from(Wallet, "w"),
        "_w",
        '_w."ownerId" = _u."clientId" AND _w."rank" <= 2',
      )
      .leftJoin(
        (sq) =>
          sq
            .select(['w.owner.id as "ownerId", COUNT(*) AS "walletCount"'])
            .from(Wallet, "w")
            .groupBy("w.owner.id"),
        "_wcount",
        '_u."clientId" = _wcount."ownerId"',
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

  @Get(
    "two-top-users-with-3-top-wallets-and-count-of-usd-wallets-with-subquery-inside-select",
  )
  async getTopUsersWith3TopWalletsAndCountOfUsdWallets() {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select(["u.id", "u.firstName"])
      .addSelect((qb1) =>
        qb1
          .select(
            `jsonb_agg(json_build_object('wId', "threeTopWalletsPerUser".id, 'wTitle', "threeTopWalletsPerUser".title, 'wBalance', "threeTopWalletsPerUser".balance))`,
          )
          .from(
            (qb2) =>
              qb2
                .select('"innerW".*')
                .from(Wallet, "innerW")
                .where(
                  `"innerW".currency = 'USD' and "innerW"."ownerId" = u.id`,
                  { currency: "USD" },
                )
                .orderBy('"innerW".balance', "DESC")
                .limit(3),
            "threeTopWalletsPerUser",
          ),
      )
      .addSelect((qb) =>
        qb
          .select(["count(*)"])
          .from(Wallet, "w")
          .where(`w.currency = 'USD' and w."ownerId" = u.id`, {
            currency: "USD",
          }),
      )
      .orderBy("u.id", "ASC")
      .limit(2)
      .getRawMany();

    return users;
  }

  @Get(
    "two-top-users-with-3-top-wallets-and-count-of-usd-wallets-with-subquery-join",
  )
  async getTopUsersWith3TopWalletsAndCountOfUsdWalletsSubQueryInsideJoin() {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select(["u.*", '"walletsCounts".count'])
      .addSelect((qb1) =>
        qb1
          .select(
            `jsonb_agg(json_build_object('wId', "threeTopWalletsPerUser".id, 'wTitle', "threeTopWalletsPerUser".title, 'wBalance', "threeTopWalletsPerUser".balance))`,
          )
          .from(
            (qb2) =>
              qb2
                .select('"innerW".*')
                .from(Wallet, "innerW")
                .where(
                  `"innerW".currency = 'USD' and "innerW"."ownerId" = u.id`,
                  { currency: "USD" },
                )
                .orderBy('"innerW".balance', "DESC")
                .limit(3),
            "threeTopWalletsPerUser",
          ),
      )
      .leftJoin(
        (qb) =>
          qb
            .select(["count(*)", '"ownerId"'])
            .from(Wallet, "w")
            .where(`w.currency = 'USD' `, { currency: "USD" })
            .groupBy("w.ownerId"),
        "walletsCounts",
        '"walletsCounts"."ownerId" = u.id',
      )
      .orderBy("u.id", "ASC")
      .limit(2)
      .getRawMany();
    return users;
  }

  @Get(
    "two-top-users-with-3-top-wallets-and-count-of-usd-wallets-with-cte-subquery",
  )
  async getTopUsersWith3TopWalletsAndCountOfUsdWalletsSubQueryInsideJoinWithCTESubquery() {
    const owner_sumQueryBuilder = this.walletsRepo
      .createQueryBuilder("w")
      .select([`CAST(sum("balance") as INT) as usd_sum`, `"ownerId"`])
      .where(`w.currency = 'USD'`)
      .groupBy('w."ownerId"');

    const top_3_wallets_queryBuilder = this.usersRepo
      .createQueryBuilder("u")
      .select("u.id as user_id")
      .addSelect(
        (qb) =>
          qb
            .select(
              `jsonb_agg(json_build_object('id', w3.id, 'title', w3.title, 'balance', w3.balance))`,
            )
            .from(
              (qb) =>
                qb
                  .select("*")
                  .from(Wallet, "w2")
                  .where(`w2."ownerId" = u."id" and w2.currency = 'USD'`)
                  .orderBy(`w2.balance`, "DESC")
                  .limit(3),
              "w3",
            ),
        "top_wallets",
      );

    const users = await this.usersRepo
      .createQueryBuilder("u")
      .addCommonTableExpression(owner_sumQueryBuilder, "owner_sum")
      .addCommonTableExpression(top_3_wallets_queryBuilder, "top_3_wallets")
      .select([
        "u.*",
        'os.usd_sum as "usdWalletsBalance"',
        't3w.top_wallets as "topWallets"',
      ])
      .leftJoin("owner_sum", "os", 'u.id = os."ownerId"')
      .leftJoin("top_3_wallets", "t3w", 'u.id = t3w."user_id"')
      .orderBy('"usdWalletsBalance"', "DESC", "NULLS LAST")
      .limit(3)
      .getRawMany();
    return users;
  }

  /**
   * такой же пример как и вверху, но без подзапроса с queryBuilderFactory а полностью на CTE сделанный
   * возможно в решении есть ошибка.. нужно перепроверить...
   */
  @Get("two-top-users-with-3-top-wallets-and-count-of-usd-wallets-with-cte")
  async getTopUsersWith3TopWalletsAndCountOfUsdWalletsSubQueryInsideJoinWithCTE() {
    const owner_sumQueryBuilder = this.walletsRepo
      .createQueryBuilder("w")
      .select([`CAST(sum("balance") as INT) as usd_sum`, `"ownerId"`])
      .where(`w.currency = 'USD'`)
      .groupBy('w."ownerId"');

    const top3WalletsTableQueryBuilder = this.walletsRepo
      .createQueryBuilder("w2")
      .select([
        "*",
        'CAST(ROW_NUMBER() OVER (PARTITION BY w2.ownerId ORDER BY w2.balance DESC) as INT) AS "walletNumber"',
      ])
      .where(`w2.currency = 'USD'`)
      .orderBy(`w2.balance`, "DESC");

    const ownerWithTop3WalletTableQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select('w3."ownerId" as "ownerId"')
      .addSelect(
        `jsonb_agg(json_build_object('id', w3.id, 'title', w3.title, 'balance', w3.balance)) as "top_wallets"`,
      )
      .from("top3_wallets_table_query_builder", "w3")
      .where('w3."walletNumber" < 4')
      .groupBy('w3."ownerId"');

    const top_3_wallets_queryBuilder = this.usersRepo
      .createQueryBuilder("u")
      .select("u.id as user_id")
      .addSelect("owner_with_top3_wallet_table.top_wallets")
      .leftJoin(
        "owner_with_top3_wallet_table",
        "owner_with_top3_wallet_table",
        'owner_with_top3_wallet_table."ownerId"=u.id',
      );

    const users = await this.usersRepo
      .createQueryBuilder("u")
      .addCommonTableExpression(owner_sumQueryBuilder, "owner_sum")
      .addCommonTableExpression(
        top3WalletsTableQueryBuilder,
        "top3_wallets_table_query_builder",
      )
      .addCommonTableExpression(
        ownerWithTop3WalletTableQueryBuilder,
        "owner_with_top3_wallet_table",
      )
      .addCommonTableExpression(top_3_wallets_queryBuilder, "top_3_wallets")
      .select([
        "u.*",
        'os.usd_sum as "usdWalletsBalance"',
        't3w.top_wallets as "topWallets"',
      ])
      .leftJoin("owner_sum", "os", 'u.id = os."ownerId"')
      .leftJoin("top_3_wallets", "t3w", 'u.id = t3w."user_id"')
      .orderBy('"usdWalletsBalance"', "DESC", "NULLS LAST")
      .limit(3)
      .getRawMany();
    return users;
  }
}
