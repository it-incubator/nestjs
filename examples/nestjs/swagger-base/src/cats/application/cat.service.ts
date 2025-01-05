import { CreateCatInputDTO } from '../dto/create-cat.input.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatService {
  create(dto: CreateCatInputDTO) {
    return { id: '1', dob: dto.dob, name: dto.name, price: dto.price };
  }
}
