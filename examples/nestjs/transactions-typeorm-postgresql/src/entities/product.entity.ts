import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column()
  availableQuantity: number;

  @Column()
  price: number;
}
