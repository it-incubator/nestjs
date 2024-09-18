import {Body, Controller, Get, Post} from '@nestjs/common';
import {CatsService} from "./cat.service";
import {Cat} from "./entities/cat.entity";

@Controller()
export class AppController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getCats() {
    return this.catsService.findAll();
  }

  @Post()
  createCat(@Body() createCatDto: Cat) {
    return this.catsService.create(createCatDto);
  }
}
