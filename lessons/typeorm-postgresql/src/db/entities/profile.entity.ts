import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @ApiProperty()
  address: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  owner: User;
}
