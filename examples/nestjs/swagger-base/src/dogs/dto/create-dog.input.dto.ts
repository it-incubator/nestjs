import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateDogInputDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsDateString()
  @IsNotEmpty()
  dob: Date;
  @IsNumber()
  @Min(10)
  @Max(100)
  @IsOptional()
  price: number;
}
