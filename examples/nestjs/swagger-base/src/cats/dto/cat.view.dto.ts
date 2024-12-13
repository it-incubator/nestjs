import { ApiProperty } from '@nestjs/swagger';

export class CatViewDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  dob: Date;
  @ApiProperty()
  price: number;
}
