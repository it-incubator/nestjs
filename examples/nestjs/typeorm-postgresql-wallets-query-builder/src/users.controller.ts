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
    @InjectRepository(WalletView)
    private walletsViewsRepo: Repository<WalletView>,
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

  // ============================================================================================
  // 3. getMany vs getRawMany: ключевая разница
  // ============================================================================================

  // 3.1. getMany() — возвращает экземпляры сущностей
  @Get("users-full-entities")
  @ApiPagination()
  async usersFullEntities(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const [users, total] = await this.usersRepo
      // createQueryBuilder() без аргумента — алиас не задан,
      // TypeORM сам сгенерирует алиас из имени сущности
      .createQueryBuilder()
      // skip = OFFSET, take = LIMIT
      // Рекомендуем использовать offset/limit для raw-запросов,
      // skip/take — для getMany (TypeORM может генерировать подзапрос для корректной пагинации)
      .skip((page - 1) * limit)
      .take(limit)
      // getManyAndCount() выполняет ДВА SQL-запроса:
      // 1) SELECT ... LIMIT ... OFFSET ... — данные
      // 2) SELECT COUNT(*) — общее кол-во
      .getManyAndCount();

    // результат — экземпляры сущности User
    console.log(users[0] instanceof User); // true

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 3.2. getRawMany() — возвращает "сырые" данные (plain objects)
  // Без явных алиасов — имена полей будут с префиксом таблицы
  @Get("users-full-entities-raw")
  @ApiPagination()
  async usersFullEntitiesRaw(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select([
        "id",
        'u.firstName as "userFirstName"',
        'u.lastName as "userLastName"',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      // getRawMany — plain objects, НЕ экземпляры сущности
      .getRawMany();

    return users;
  }

  // Дополнительный пример: raw + class-transformer (не основной подход)
  @Get("users-entities-raw-with-transformation")
  @ApiPagination()
  async usersEntitiesWithTransformation(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      // обращаемся к колонкам БД напрямую (snake_case)
      .select(["id", "first_name", "last_name"])
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    // plainToInstance маппит raw-данные в DTO по декораторам @Expose
    const transformedUsers = plainToInstance(UserViewModel, users, {
      excludeExtraneousValues: true,
    });

    return transformedUsers;
  }

  // getRawMany() с правильными алиасами — основной подход для query-репозиториев
  @Get("users-entities-raw-with-aliases")
  @ApiPagination()
  async usersEntitiesWithAliases(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select([
        'id as "id"',                  // колонка id → свойство "id"
        'u.firstName as "firstName"',  // двойные кавычки обязательны для camelCase в PostgreSQL
        'u.lastName as "lastName"',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return users;
  }

  // ============================================================================================
  // 4. Базовые примеры
  // ============================================================================================

  // 4.2. Частичная выборка полей (partial select) — getMany с ограниченным набором полей
  @Get("users-partially-entities")
  @ApiPagination()
  async usersPartiallyEntities(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      // перечисляем ТОЛЬКО нужные поля через "алиас.поле"
      // Это НЕ raw SQL, а нотация TypeORM для свойств сущности.
      // TypeORM сам транслирует "u.firstName" в SQL и маппит обратно.
      // Алиасы (as "...") здесь не нужны и не работают — это формат для getRawMany()
      .select(["u.id", "u.firstName", "u.lastName"])
      // ВАЖНО: .select(['u.*']) — SQL валидный, но TypeORM не сможет распарсить результат в сущность
      //.select(['u.*'])
      .skip((page - 1) * limit)
      .take(limit)
      // getMany() вернёт экземпляры User, но ТОЛЬКО с выбранными полями
      .getMany();

    // невыбранные поля НЕ существуют на объекте — их нет вообще!
    console.log("isMarried: ", users[0].isMarried); // undefined
    console.log("hasOwnProperty: ", users[0].hasOwnProperty("isMarried")); // false

    let total = 10;
    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 4.4. Динамическое построение запроса (фильтрация)
  @Get("users-entities-raw-with-filter")
  @ApiPagination()
  @ApiQuery({ name: "firstName", required: false, type: String })
  async usersEntitiesWithFilter(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("firstName") firstName: string | null = null,
  ) {
    // сохраняем QueryBuilder в переменную — будем дополнять условно
    let userSelectQueryBuilder = this.usersRepo
      .createQueryBuilder("u")
      .select(["id", '"firstName"', '"lastName"']);

    // динамически добавляем WHERE, только если есть фильтр
    if (firstName) {
      // :firstName — параметризованное значение (защита от SQL-инъекций)
      userSelectQueryBuilder.where('"firstName" like :firstName', {
        firstName: firstName,
      });
    }

    userSelectQueryBuilder.skip((page - 1) * limit).take(limit);

    // один и тот же QueryBuilder для данных и для count
    const users = await userSelectQueryBuilder.getRawMany();
    const count = await userSelectQueryBuilder.getCount();
    return { users, count };
  }

  // ============================================================================================
  // 5. JOIN: объединение таблиц
  // ============================================================================================

  // 5.1. leftJoinAndSelect — загрузка связей в сущности
  @Get("users-full-entities-with-wallets")
  @ApiPagination()
  async usersFullEntitiesWithWallets(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const [users, total] = await this.usersRepo
      .createQueryBuilder("u")
      // LEFT JOIN + автоматический маппинг в свойство u.wallets
      // "u.wallets" — имя связи из сущности User (@OneToMany wallets)
      // Когда используется .select(), можно заменить leftJoinAndSelect на leftJoin
      .leftJoinAndSelect("u.wallets", "w")
      // выбираем конкретные поля — TypeORM маппит в свойства сущностей
      .select(["u.id", "u.firstName", "w.id", "w.balance"])
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

  // Дополнительный пример: leftJoinAndMapMany — маппинг JOIN в произвольное свойство
  @Get("users-with-wallets")
  @ApiPagination()
  async getUsersWithWallets(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      // leftJoinAndMapMany — в отличие от leftJoinAndSelect, позволяет
      // замаппить результат JOIN в ПРОИЗВОЛЬНОЕ свойство объекта (не обязательно
      // совпадающее с именем связи в сущности).
      // 1-й аргумент: куда маппить ("u.wallets" — свойство на результате)
      // 2-й аргумент: что джойнить ("u.wallets" — связь из сущности)
      // 3-й аргумент: алиас ("w")
      // 4-й аргумент (необязательный): доп. условие к ON
      //   Пример: .leftJoinAndMapMany("u.wallets", "u.wallets", "w", "w.balance > 100")
      //   SQL: LEFT JOIN wallet w ON w."ownerId" = u.id AND w.balance > 100
      //   TypeORM сам добавляет условие связи из @ManyToOne, а 4-й аргумент дополняет через AND.
      //   Можно использовать параметры: "w.currency = :cur", { cur: "USD" }
      //   Этот 4-й аргумент работает так же в leftJoinAndSelect и leftJoin.
      .leftJoinAndMapMany("u.wallets", "u.wallets", "w")
      .select(["u.id", "w.id", "w.balance", "w.title"])
      .getMany();

    // Можно маппить в кастомное свойство, которого нет в сущности User:
    // .leftJoinAndMapMany("u.topWallets", "u.wallets", "w", "w.balance > 100")
    // SQL: LEFT JOIN wallet w ON w."ownerId" = u.id AND w.balance > 100
    // Результат: users[0].topWallets = [{ id: '...', balance: 150 }, ...]
    // TypeScript не знает о свойстве topWallets — нужен каст (as any)
    // или добавление свойства в класс.
    // Элементы массива — экземпляры Wallet (сущности, не plain objects).

    const total = 10;
    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 5.2. Проблема пагинации при JOIN
  // LEFT JOIN создаёт строку для КАЖДОЙ пары (user, wallet).
  // offset/limit считает строки JOIN-результата, а не юзеров!
  // Юзер с 10 кошельками = 10 строк → LIMIT 10 вернёт кошельки ОДНОГО юзера.
  // Решение — CTE "сначала ID, потом данные" (см. 7.3)
  @Get("users-with-wallets-pagination-problem")
  @ApiPagination()
  async getUsersWithWalletsPaginationProblem(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select(['u.id as "id"', 'w.balance as "balance"'])
      // LEFT JOIN: каждая пара (user, wallet) = отдельная строка
      .leftJoin("u.wallets", "w")
      // ПРОБЛЕМА: offset/limit считает строки после JOIN, а не юзеров
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();
    // Попробуйте: limit=10, и увидите данные ~1 юзера вместо 10

    return { data: users };
  }

  // 5.3. leftJoin с кастомным условием — для raw-запросов
  @Get("wallets-with-owner-name")
  async walletsWithOwnerFirstName() {
    const wallets = await this.walletsRepo
      .createQueryBuilder("w")
      // leftJoin с кастомным ON-условием (не через имя связи):
      // 1-й аргумент: сущность, 2-й: алиас, 3-й: ON-условие
      // Здесь условие 'u.id = w."ownerId"' совпадает со связью @ManyToOne в Wallet,
      // можно было бы написать просто: .leftJoin("w.owner", "u")
      // Кастомное условие нужно, когда связи в сущности НЕТ —
      // например, джойн по бизнес-логике: 'u.regionId = w."regionId" AND u.role = :role'
      .leftJoin(User, "u", 'u.id = w."ownerId"')
      // двойные кавычки вокруг camelCase-колонок — обязательны в PostgreSQL
      .select(['u."firstName"', 'w."currency"', 'w."addedAt"'])
      .getRawMany();
    return wallets;
  }

  // ============================================================================================
  // 6. JSON-функции PostgreSQL: формирование проекций
  // ============================================================================================

  // 6.1. Подход без JSON — getMany() загружает ВСЕ поля связанной сущности
  @Get("wallets-with-owner")
  @ApiPagination()
  async getWalletsWithOwner(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const wallets = await this.dataSource
      // createQueryBuilder(Wallet, "w") — билдер через DataSource с указанием сущности
      .createQueryBuilder(Wallet, "w")
      // leftJoinAndSelect — джойним + маппим связь "owner" в свойство Wallet.owner
      // owner будет содержать ВСЕ поля User (включая passportNumber, isMarried и т.д.)
      .leftJoinAndSelect("w.owner", "u")
      .getMany();

    return {
      data: wallets,
      page,
      limit,
    };
  }

  // 6.1. json_build_object — вложенный объект с контролем полей
  @Get("wallets-with-owner-json_build_object")
  @ApiPagination()
  async getWalletsWithOwner_json_build_object(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const wallets = await this.dataSource
      .createQueryBuilder(Wallet, "w")
      .select([
        "w.*",
        // json_build_object — PostgreSQL-функция, создаёт JSON-объект из пар ключ-значение
        // результат: { "firstName": "User1" } — только нужные поля, ничего лишнего
        `json_build_object('firstName', u.firstName) as owner`,
      ])
      // leftJoin (без AndSelect!) — джойним, но НЕ маппим в сущность
      .leftJoin("w.owner", "u")
      // ОБЯЗАТЕЛЬНО getRawMany — getMany() не сможет замаппить JSON-колонку
      .getRawMany();

    return {
      data: wallets,
      page,
      limit,
    };
  }

  // 6.2. jsonb_agg + COALESCE — агрегация one-to-many в массив
  @Get("users-with-wallets-jsonb_agg-with_default-emptyarray")
  @ApiPagination()
  async getWalletsWithOwner_jsonb_agg(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const wallets = await this.dataSource
      .createQueryBuilder(User, "u")
      // select — поля юзера (они же будут в GROUP BY)
      .select(["u.id", 'u."firstName"'])
      // addSelect — добавляет выражение в SELECT (не перезатирает .select)
      .addSelect(
        // Разбор по слоям (изнутри наружу):
        // 1) json_build_object(...) — из каждой строки wallet делает JSON-объект
        // 2) jsonb_agg(...) — собирает все объекты группы в JSON-массив
        // 3) FILTER (WHERE w.id IS NOT NULL) — исключает NULL-строки от LEFT JOIN
        // 4) COALESCE(..., '[]') — если нет кошельков, заменяет NULL на пустой массив
        `COALESCE(
                jsonb_agg(
                       json_build_object('id', w.id, 'balance', w.balance, 'currency', w.currency, 'addedAt', w."addedAt", 'deletedAt', w."deletedAt")
                    ) FILTER (WHERE w.id IS NOT NULL),
                '[]')
                as wallets`,
      )
      // LEFT JOIN — юзеры БЕЗ кошельков тоже попадут в результат
      .leftJoin("u.wallets", "w")
      // GROUP BY — обязателен при использовании агрегатных функций (jsonb_agg)
      // После GROUP BY одна строка = один юзер → пагинация через offset/limit корректна
      .groupBy("u.id")
      // пагинация — работает корректно, т.к. GROUP BY схлопнул строки
      .offset((page - 1) * limit)
      .limit(limit)
      // getRawMany — JSON-агрегаты работают только с raw
      .getRawMany();

    return {
      data: wallets,
      page,
      limit,
    };
  }

  // ============================================================================================
  // 7. Оконные функции (Window Functions)
  // ============================================================================================

  // 7.1. ROW_NUMBER с PARTITION BY — нумерация кошельков внутри каждого владельца
  @Get("wallets-with-row-number-by-owner-id")
  async walletsWithRowNumberByOwnerId() {
    const wallets = await this.walletsRepo
      .createQueryBuilder("w")
      .select([
        "w.currency as currency",
        'w.addedAt as "addedAt"',
        'w.ownerId as ownerId',

        // ROW_NUMBER() — оконная функция, нумерует строки
        // PARTITION BY w.ownerId — нумерация начинается заново для каждого владельца
        // ORDER BY w.addedAt — порядок нумерации внутри группы
        // CAST(... AS INT) — ROW_NUMBER возвращает bigint, приводим к INT,
        // иначе pg-драйвер вернёт строку ("1") вместо числа (1).
        // Альтернатива: PostgreSQL-синтаксис (ROW_NUMBER()...)::INT — короче, но не переносимо на другие БД
        'CAST(ROW_NUMBER() OVER (PARTITION BY w.ownerId ORDER BY w.addedAt) as INT) AS "walletNumber"',
      ])
      // только getRawMany — оконные функции не маппятся в сущности
      .getRawMany();
    return wallets;
  }

  // 7.2. Database View как альтернатива — если оконная функция нужна в нескольких запросах
  @Get("wallets-with-row-number-from-view")
  async walletsWithRowNumberByOwnerIdFromView() {
    const wallets = await this.walletsViewsRepo
      .createQueryBuilder("w")
      // getMany() работает — WalletView это обычная "сущность" для TypeORM
      .getMany();
    return wallets;
  }

  // ============================================================================================
  // 8. CTE и подзапросы
  // ============================================================================================

  // 8.1. CTE (WITH-выражение) — пагинация по номеру строки
  @Get("wallets-paginated-with-row-number-with-cte")
  async walletsPaginatedWithRowNumber() {
    // Шаг 1: формируем QueryBuilder — он станет телом CTE
    const walletsWithRowsNumberBuilder = this.walletsRepo
      .createQueryBuilder("w")
      .select([
        "w.*",
        // ROW_NUMBER() без PARTITION BY — нумерация по ВСЕМ кошелькам
        'ROW_NUMBER() OVER (ORDER BY w."addedAt") AS "walletNumber"',
      ]);
    // Этот QueryBuilder НЕ выполняется сам — он будет использован как CTE

    // Шаг 2: основной запрос, использующий CTE
    const wallets = await this.dataSource
      // createQueryBuilder() без сущности — "чистый" билдер
      .createQueryBuilder()
      // добавляем CTE: WITH "wallets_with_rows_number" AS (SELECT ...)
      .addCommonTableExpression(
        walletsWithRowsNumberBuilder,
        "wallets_with_rows_number",
      )
      .select("wrn.*")
      // FROM — ссылаемся на CTE по имени
      .from("wallets_with_rows_number", "wrn")
      // фильтруем по номеру строки (пагинация по walletNumber)
      .where('wrn."walletNumber" BETWEEN :from and :to', { from: 10, to: 20 })
      .getRawMany();

    return wallets;
  }

  // 8.2. Подзапрос (Subquery) — та же задача, но через подзапрос вместо CTE
  @Get("wallets-paginated-with-row-number-with-subquery")
  async walletsPaginatedWithRowNumberWithSubquery() {
    // фабрика подзапроса — TypeORM вызовет эту функцию и подставит результат в FROM
    let walletsWithNumbersQueryBuilderFactory = (
      subQueryBuilder: SelectQueryBuilder<Wallet>,
    ) =>
      subQueryBuilder
        .select([
          "w.*",
          'ROW_NUMBER() OVER (ORDER BY w."addedAt") AS "walletNumber"',
        ])
        .from(Wallet, "w");

    const wallets = await this.dataSource
      .createQueryBuilder()
      // .from() принимает фабрику подзапроса вместо имени таблицы
      // SQL: FROM (SELECT w.*, ROW_NUMBER()... FROM wallet w) wrn
      .from(walletsWithNumbersQueryBuilderFactory, "wrn")
      .where('wrn."walletNumber" BETWEEN 10 and 20')
      .getRawMany();

    return wallets;
  }

  // 8.3. CTE для корректной пагинации с JOIN — паттерн "сначала ID, потом данные"
  @Get("users-with-wallets-with-cte")
  @ApiPagination()
  async getUsersWithWalletsWithCTE(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    // Шаг 1: получаем total (до пагинации, без JOIN)
    let userSelectQueryBuilder = this.usersRepo.createQueryBuilder("u");
    const total = await userSelectQueryBuilder.getCount();

    // Шаг 2: формируем CTE — список ID юзеров для текущей страницы
    const paginatedUsersQueryBuilder = userSelectQueryBuilder
      // select с 2 аргументами: колонка + алиас в CTE
      .select("u.id", "paginatedUserId")
      .orderBy("u.lastName", "ASC")
      // пагинация работает корректно, т.к. нет JOIN!
      .skip((page - 1) * limit)
      .take(limit);

    // Шаг 3: основной запрос — данные ТОЛЬКО для отобранных юзеров
    const users = await this.usersRepo
      .createQueryBuilder("u")
      // добавляем CTE: WITH "paginated_users" AS (SELECT u.id ...)
      .addCommonTableExpression(paginatedUsersQueryBuilder, "paginated_users")
      // теперь безопасно делаем JOIN — мы уже знаем КАКИЕ юзеры нам нужны
      .leftJoinAndSelect("u.wallets", "w")
      // фильтр: только юзеры, чьи ID есть в CTE
      .where(`u.id IN (SELECT "paginatedUserId" FROM "paginated_users")`)
      .getMany();
    // Важно: getManyAndCount() здесь некорректно — count считал бы с JOIN

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

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

  @Get("users-with-wallets-count-with-subquery")
  @ApiPagination()
  async getUsersWithWalletsCountWithSubQuery(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    let ownerIdsWithWalletsCounts = (sq: SelectQueryBuilder<Wallet>) =>
      sq
        .select(["w.ownerId", "count(1) as count"])
        .from(Wallet, "w")
        .groupBy("w.ownerId");

    const users = await this.usersRepo
      .createQueryBuilder("u")
      .select(["u.*", '"walletsCounts".count'])
      .leftJoin(
        ownerIdsWithWalletsCounts,
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

  @Get("users-with-top-wallets")
  @ApiPagination()
  async getUsersWithTopWallets2(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const users = await this.dataSource
      .createQueryBuilder()
      .select(["u.*", 'wcount."walletCount"', "w.*"])
      .from((subQuery) => {
        return subQuery
          .select("*")
          .from(User, "u")
          .offset((page - 1) * limit)
          .limit(limit);
      }, "u")
      .leftJoinAndMapMany(
        "u.wallets",
        (subQuery) =>
          subQuery
            .select([
              "w.*",
              'ROW_NUMBER() OVER (PARTITION BY w."ownerId" ORDER BY w."balance" DESC) as rank',
            ])
            .from(Wallet, "w"),
        "w",
        'w."ownerId" = u."id" AND w.rank <= 2',
      )
      .leftJoin(
        (sq) =>
          sq
            .select(['w.ownerId as "ownerId", COUNT(*) AS "walletCount"'])
            .from(Wallet, "w")
            .groupBy("w.ownerId"),
        "wcount",
        'u.id = wcount."ownerId"',
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
