import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDogInputDTO } from '../dto/create-dog.input.dto';
import { validate } from 'class-validator';

@Injectable()
export class DogService {
  async create(dto: CreateDogInputDTO) {
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return { id: '1', dob: dto.dob, name: dto.name, price: dto.price };
  }
}
