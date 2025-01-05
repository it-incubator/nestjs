import { ApiProperty } from '@nestjs/swagger';

export class DogViewDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  dob: Date;
  @ApiProperty()
  price: number;
}
