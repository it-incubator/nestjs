import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity()
@Index()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    nullable: true,
  })
  @Index({unique: true})
  email: string | null;

  @Column({
    default: 10,
  })
  // @Index()
  balance: number;

  @Column()
  @Index({unique: true})
  login: string;

  @Column()
  dob: Date;
}
