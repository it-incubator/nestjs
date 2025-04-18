import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  product: string;

  @IsNotEmpty()
  @IsDateString()
  orderDate: string;

  @IsNotEmpty()
  userId: string;
}
