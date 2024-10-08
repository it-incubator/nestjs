import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  extraTitle: string;

  @Column()
  price: number;

  // @Column()
  // discount: number;
}
