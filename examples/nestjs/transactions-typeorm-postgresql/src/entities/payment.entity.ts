import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Product } from './product.entity';

@Entity()
export class Payment {
  @PrimaryColumn()
  id: number;

  /**
   * sum price of all products
   */
  @Column()
  amount: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
