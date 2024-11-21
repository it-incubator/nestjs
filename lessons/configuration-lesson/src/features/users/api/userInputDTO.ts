import { ApiProperty } from "@nestjs/swagger";

export class UserInputDTO {
  @ApiProperty({
    example: 'dimych',
  })
  login: string;
  @ApiProperty({
    example: 'email@gmail.com',
  })
  email: string;
}