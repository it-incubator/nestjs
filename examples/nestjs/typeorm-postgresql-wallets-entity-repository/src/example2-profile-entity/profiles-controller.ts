import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Client } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../db/entities/profile.entity';
import { InputProfileDto } from './dto';

@Controller('profiles')
export class ProfilesController {
    constructor(
        @InjectRepository(Profile) private profilesRepo: Repository<Profile>,
    ) {
    }

    @Get()
    async getAllProfiles(): Promise<Profile[]> {
        return await this.profilesRepo.find({ relations: {
            client: {
                wallets: true
            } } });
    }

    @Get(':id')
    async getProfileByUserId(@Param('userId') id: number): Promise<Profile | undefined> {
        return await this.profilesRepo.findOne({ where: { id }, relations: ['user'] });
    }

    @Post()
    async createProfile(@Body() createProfileDto: InputProfileDto): Promise<Profile> {
        const profile = this.profilesRepo.create(createProfileDto);
        profile.client = {id: createProfileDto.userId} as Client;
        return await this.profilesRepo.save(profile);
    }

    @Post('create-with-user')
    async createProfileWithUser(@Body() createProfileDto: InputProfileDto): Promise<Profile> {
        const profile = this.profilesRepo.create(createProfileDto);
        profile.client = {firstName: 'dimych', isMarried: false, lastName: 'kuzyuberdin'} as Client;
        return await this.profilesRepo.save(profile);
    }

    @Put(':id')
    async updateProfile(
      @Param('id') id: number,
      @Body() updateProfileDto: InputProfileDto
    ): Promise<Profile | undefined> {
        const profile = await this.profilesRepo.findOne({ where: { id } });
        if (!profile) return undefined;

        Object.assign(profile, updateProfileDto);
        await this.profilesRepo.save(profile);

        return profile;
    }

    @Delete(':id')
    async deleteProfile(@Param('id') id: number): Promise<void> {
        await this.profilesRepo.delete(id);
    }

    @Delete(':id/with-user')
    async deleteProfileWithUser(@Param('id') id: number): Promise<void> {
        // не работает, ну и фиг с ним. опасный кейс так удалять. Получается какая-то зависимая от user
        // очередная табличка может похерить нам самого юзера?.. хм.. опасно...
        const profile = await this.profilesRepo.findOne({
            where: { id },
            relations: ['user']
        });
        await this.profilesRepo.remove(profile);
    }
}

