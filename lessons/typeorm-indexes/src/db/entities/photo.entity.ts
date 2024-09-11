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
@Index("IDX_e855f7e3519a6c2324c047b698", { synchronize: false })
@Index(['ownerId', 'addedAt'])
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

  @Column()
  addedAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @CreateDateColumn()
  createdAt: Date;

}
