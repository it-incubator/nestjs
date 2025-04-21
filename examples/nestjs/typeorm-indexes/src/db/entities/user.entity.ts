import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity()
//@Index('first_last_names_index_fg837g487g478', ['firstName', 'lastName'])
// @Index('idx_user_first_name_covering', {
//   /**
//    * CREATE INDEX idx_user_first_name_covering
//    *       ON "user" ("firstName")
//    *       INCLUDE ("lastName", "id", "email");
//    */
//   synchronize: false // покрывающий индекс
// })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  //@Index()
  firstName: string;

  @Column()
  //@Index()
  lastName: string;

  @Column({
    nullable: true,
  })
  //@Index({unique: true})
  email: string | null;

  @Column({
    default: 10,
  })
  // @Index()
  balance: number;

  @Column()
  //@Index({unique: true})
  login: string;

  @Column()
  dob: Date;
}
