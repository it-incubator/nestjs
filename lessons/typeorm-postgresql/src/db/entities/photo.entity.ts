import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Album } from './album.entity';

const ownerId = 'ownerId';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => User)
  @JoinColumn({
    name: ownerId,
  })
  owner: User;

  @ManyToMany(() => Album)
  @JoinTable({ name: 'photo_albums_album' })
  albums: Album[];

  @Column()
  [ownerId]: number;
}
