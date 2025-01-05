import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DogService } from '../application/dog.service';
import { CreateDogInputAPIDTO } from './dto/create-dog.input.dto';
import { DogViewDto } from './dto/dog-view.dto';

@ApiBearerAuth()
@Controller('dogs')
export class DogsController {
  constructor(private dogService: DogService) {}
  @Get()
  async getAll(): Promise<{ name: string }[]> {
    return [{ name: 'sharik' }];
  }

  /**
   * Create a new dog
   *
   * @remarks This operation allows you to create a new dog.
   *
   * @returns {201} The dog has been successfully created.
   * @throws {500} Something went wrong.
   * @throws {400} Bad Request.
   */
  @Post()
  @ApiBearerAuth()
  async create(@Body() dto: CreateDogInputAPIDTO): Promise<DogViewDto> {
    return this.dogService.create(dto);
  }
}
