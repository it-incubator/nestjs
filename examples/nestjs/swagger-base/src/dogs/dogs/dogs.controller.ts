import { Controller, Get } from '@nestjs/common';

@Controller('dogs')
export class DogsController {
  @Get()
  async getAll(): Promise<{ name: string }[]> {
    return [{ name: 'sharik' }];
  }
}
