import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  balance: number;

  @Column()
  @ApiProperty()
  currency: 'USD' | 'EUR';
}
