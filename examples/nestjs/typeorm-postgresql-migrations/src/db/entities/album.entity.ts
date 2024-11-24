import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  /**
   * @deprecated Use `AlbumInfo entity` instead.
   */
  photosCount: string;

  @Column()
  description: Date; // migration
}

@Entity()
export class AlbumInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @Column()
  updatedAt: Date;
}
