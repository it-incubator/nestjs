import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import {User} from "./user.entity";

@Entity()
export class Profile {
  @PrimaryColumn()
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  hobby: string;

  @Column({ type: 'varchar', nullable: true })
  education: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
