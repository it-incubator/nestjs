import { IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isActive: boolean;
}
