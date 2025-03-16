import { IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
