import {
  Column, CreateDateColumn,
  Entity, Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Album } from './album.entity';

const ownerId = 'ownerId';

@Entity()
@Index("covered_index_by_ownerid_with_id", { synchronize: false })
//@Index(['ownerId', 'addedAt'])
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
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

  @Column()
  addedAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @CreateDateColumn()
  createdAt: Date;

}
