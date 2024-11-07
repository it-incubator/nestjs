import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column()
  balance: number;
}
