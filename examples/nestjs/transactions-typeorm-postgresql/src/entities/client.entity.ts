import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column()
  balance: number;
}
