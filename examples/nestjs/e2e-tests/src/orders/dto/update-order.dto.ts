import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateOrderDTO {
  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsDateString()
  orderDate?: string;
}
