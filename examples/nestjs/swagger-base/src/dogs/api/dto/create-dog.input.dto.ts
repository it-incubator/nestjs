import { CreateDogInputDTO } from '../../dto/create-dog.input.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CopyValidationDecorators } from '../../../common/copy-validation-decorators.decorator';

export class CreateDogInputAPIDTO {
  @ApiProperty({ description: 'The name of the dog' })
  @CopyValidationDecorators(CreateDogInputDTO, 'name')
  name: string;

  @ApiProperty({ description: 'The date of birth of the dog' })
  @CopyValidationDecorators(CreateDogInputDTO, 'dob')
  dob: Date;

  @ApiProperty({ description: 'The price of the dog' })
  // @Min(10)
  // @Max(100)
  // @IsOptional()
  @CopyValidationDecorators(CreateDogInputDTO, 'price') // it's imposiible because Swagger collects metadata at compile time.
  price: number;
}
