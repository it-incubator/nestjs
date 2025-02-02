import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class BaseDBEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // https://typeorm.io/entities#special-columns
  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date | null;

  @VersionColumn({
    default: 0
  })
  public version: number;
}
