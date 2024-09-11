import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { User } from './db/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Profile } from './db/entities/profile.entity';
import { Photo } from './db/entities/photo.entity';
import { Album } from './db/entities/album.entity';
import { Account } from './auth/db/account.entity';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Photo) private photosRepo: Repository<Photo>,
    @InjectRepository(Album) private albumsRepo: Repository<Album>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersRepo.find();
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

    this.usersRepo.save(body);

    // await this.usersRepo.insert(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: User) {
    const user = await this.usersRepo.findOneBy({ id: Number(id) });
    user.setName(body.name);
    await this.usersRepo.save(user);
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
