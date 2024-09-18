import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './db/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Profile } from './db/entities/profile.entity';
import { Photo } from './db/entities/photo.entity';
import { Album } from './db/entities/album.entity';
import { Account } from './auth/db/account.entity';
import { Wallet } from './finance/db/wallet.entity';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Wallet) private walletsRepo: Repository<Wallet>,
    @InjectRepository(Photo) private photosRepo: Repository<Photo>,
    @InjectRepository(Album) private albumsRepo: Repository<Album>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  @Get('wallets')
  async getAllWallets(): Promise<Wallet[]> {
    return this.walletsRepo.find();
  }

  @Get('wallets-raw')
  async getAllWalletsRaw(): Promise<any[]> {
    return this.walletsRepo
      .createQueryBuilder('w')
      .select('w.balance', 'w.id')
      .getMany();
  }

  @Get('photos')
  async getPhotos() {
    // const photos = await this.photosRepo
    //   .createQueryBuilder('p')
    //   .select(['p'])
    //   .leftJoinAndSelect('p.albums', 'a')
    //   .getRawAndEntities();

    // const photos = await this.photosRepo
    //   .createQueryBuilder('p')
    //   .leftJoinAndSelect('p.albums', 'a')
    //   .skip(0) // OFFSET value (e.g., page * pageSize)
    //   .take(1) // LIMIT value (e.g., pageSize)
    //   .getMany(); // This gets the paginated photos with their albums and the total count

    // const photos = await this.photosRepo
    //   .createQueryBuilder('p')
    //   .leftJoinAndSelect('p.albums', 'a')
    //   .skip(0) // OFFSET value (e.g., page * pageSize)
    //   .take(1) // LIMIT value (e.g., pageSize)
    //   .getMany(); //

    const photos = await this.photosRepo
      .createQueryBuilder('p')
      .leftJoinAndMapMany(
        'p.albums',
        (qb) =>
          qb
            .select('a.*')
            .from('album', 'a')
            .innerJoin('photo_albums_album', 'paa', 'paa."albumId" = a."id"')
            .where(
              'paa."photoId" IN (SELECT "id" FROM "photo" WHERE "id" = p.id)',
            )
            .limit(2),
        'a',
        'a.id = paa."albumId"',
      )
      .skip(0) // Offset for photo pagination
      .take(1) // Limit for photos per page
      .getMany();

    return photos;
  }

  @Get('albums')
  async getAlbums() {
    const albums = await this.albumsRepo
      .createQueryBuilder('a')
      .select(['a'])
      .getMany();
    return albums;
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    return this.usersRepo.findOneBy({
      id: Number(id),
    });
  }

  @Post()
  create(@Body() body: User) {
    if (true) {
      body.balance = 10;
    }

    const user = this.usersRepo.create();
    user.balance = 10;
    user.setName(body.firstName, body.lastName);

    this.usersRepo.save(user);

    // await this.usersRepo.insert(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const user = await this.usersRepo.findOneBy({ id: Number(id) });
    console.log(body);
    if ((body.firstName && body.lastName) || body.name) {
      user.setName(body.firstName, body.lastName);
      await this.usersRepo.save(user);
    } else {
      throw new BadRequestException('incorrect username');
    }
  }

  @Put(':id/profile')
  async updateProfile(@Param('id') id: string, @Body() body: Profile) {
    const user = await this.usersRepo.findOneBy({ id: Number(id) });
    user.setAddress(body.address);
    await this.usersRepo.save(user);
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    const user = await this.usersRepo.findOne({
      where: {
        id: Number(id),
      },
      relations: ['profile'],
    });
    return user.profile;
  }

  @Post(':id/profile')
  async createProfile(@Param('id') id: string, @Body() body: Profile) {
    const user = await this.usersRepo.findOne({
      where: {
        id: Number(id),
      },
      relations: ['profile'],
    });

    user.profile = new Profile();
    user.profile.address = body.address;
    console.log(user);
    await this.usersRepo.save(user);
  }

  @Post(':id/photo')
  async createPhoto(@Param('id') id: string) {
    const photo = new Photo();
    photo.url = 'https://blablabal.com/id=3';
    //photo.user = { id: Number(id) } as User;
    photo.ownerId = Number(id);

    await this.photosRepo.save(photo);
  }

  @Post('albums')
  async creatAlbum() {
    const album = new Album();
    album.title = 'album';
    await this.albumsRepo.save(album);
  }

  @Put('albums/:albumId/photos/:photoId')
  async addPhoto(
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
  ) {
    // const photo = await this.photosRepo.findOne({
    //   where: { id: Number(photoId) },
    //   relations: { albums: true },
    // });
    //
    // photo.albums.push({ id: Number(albumId) } as Album);

    // await this.dataSource
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Album)
    //   .values({} as any)
    //   .execute();

    let builder = this.dataSource
      .createQueryBuilder()
      .select(['a.id', 'a.title', 'u.name'])
      .from(Album, 'a')
      .leftJoinAndSelect('p.users', 'u');

    const count = await builder.getCount();

    builder = builder.skip(10);
    builder = builder.take(20);

    const data = await builder.getMany();

    await this.dataSource
      .createQueryBuilder()
      .update(Album)
      .set({} as any)
      .execute();

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into('photo_albums_album') // Имя авто-сгенерированной таблицы для связи many-to-many
      .values([
        { albumId: Number(albumId), photoId: Number(photoId) }, // Идентификаторы для связываемых сущностей
      ])
      .execute();

    // await this.photosRepo.save(photo);
  }
}
