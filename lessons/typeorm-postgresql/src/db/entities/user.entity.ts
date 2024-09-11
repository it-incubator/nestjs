import {
  Check,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  email: string | null;

  @Column({
    default: 10,
  })
  balance: number;

  @OneToOne(() => Profile, (profile) => profile.owner, { cascade: true })
  profile: Profile;

  setName(newName: string) {
    const namesParts = newName.split(' ');
    if (namesParts.length < 2) throw Error('Incorrect name');

    this.name = newName;
  }

  setAddress(newAddress) {
    const userIdVIP = true;
    if (userIdVIP) {
      this.profile.address = newAddress;
    }
  }
}
