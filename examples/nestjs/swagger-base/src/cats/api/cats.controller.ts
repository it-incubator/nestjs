import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CatViewDTO } from '../dto/cat.view.dto';
import { CreateCatInputDTO } from '../dto/create-cat.input.dto';
import { GetCatsQueryDTO } from '../dto/get-cats.query.dto';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { CatService } from '../application/cat.service';

/**
 * Работа с котами для юзеров с авторизацией и без
 */
@Controller('cats')
export class CatsController {
  constructor(private catService: CatService) {}
  /**
   * Ищем котов.
   * @throws {400} Bad Request
   */
  @Get()
  async getAll(@Query() query: GetCatsQueryDTO): Promise<CatViewDTO[]> {
    return [{ id: '1', dob: new Date(), name: 'Barsik', price: 10 }];
  }
  /**
   * Create a new cat
   *
   * @remarks This operation allows you to create a new cat.
   *
   * @returns {201} The cat has been successfully created.
   * @throws {500} Something went wrong.
   * @throws {400} Bad Request.
   */
  @Post()
  @ApiBearerAuth()
  async create(@Body() dto: CreateCatInputDTO): Promise<CatViewDTO> {
    return this.catService.create(dto);
  }

  /**
   * Create a new cat
   *
   * @remarks This operation allows you to create a new cat.
   *
   * @deprecated
   * @throws {500} Something went wrong.
   * @throws {400} Bad Request.
   */
  @Post('create')
  @ApiBasicAuth()
  async oldCreate(@Body() dto: CreateCatInputDTO): Promise<CatViewDTO> {
    return { id: '1', dob: dto.dob, name: dto.name, price: dto.price };
  }
}
