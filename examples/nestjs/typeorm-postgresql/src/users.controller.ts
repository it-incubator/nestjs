import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {Repository} from "typeorm";
import {User, UserStatus} from "./db/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Profile} from "./db/entities/profile.entity";

@Controller("users")
export class UsersController {
    constructor(private readonly appService: AppService,
                @InjectRepository(User)
                private readonly usersRepo: Repository<User>,
                @InjectRepository(Profile)
                private readonly profilesRepo: Repository<Profile>
    ) {
    }

    @Get()
    getAll() {
        return this.usersRepo.find();
    }

    @Get(":id")
    getById(@Param('id') id: string) {
        return this.usersRepo.findOneBy({id: Number(id)});
    }

    @Post()
    create(@Body() body: User) {
        body.views = 0;
        body.status = UserStatus.NotValidated;
        return this.usersRepo.insert(body);
    }

    @Get(":id/profile")
    async getProfile(@Param('id') id: string) {
        const profile = await this.profilesRepo.findOne({
            where: {
                owner: {id: Number(id)} as User
            },
            //relations: ['user'], // Подгружаем связанную сущность
        });
        console.log(profile)
        return profile;

    }

    @Post(":id/profile")
    async createProfile(@Param('id') id: string, @Body() body: Profile) {
        body.owner = {id: Number(id)} as User
        await this.profilesRepo.insert(body);
    }
}
