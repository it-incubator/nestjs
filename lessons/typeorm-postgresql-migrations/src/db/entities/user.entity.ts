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
  @ApiProperty({
    deprecated: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  dateOfBirth: Date;

  @Column()
  @ApiProperty()
  firstName: string;

  @Column()
  @ApiProperty()
  lastName: string;

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

  setName(firstName: string, lastName: string) {
    // const namesParts = newName.split(' ');
    // if (namesParts.length < 2) throw Error('Incorrect name');

    this.firstName = firstName;
    this.lastName = lastName;

    this.name = `${firstName} ${lastName}`;
  }

  setAddress(newAddress) {
    const userIdVIP = true;
    if (userIdVIP) {
      this.profile.address = newAddress;
    }
  }
}
