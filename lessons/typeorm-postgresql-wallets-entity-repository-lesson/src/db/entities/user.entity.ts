import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BaseDBEntity} from "./baseDBEntity";
import {Wallet} from "./wallet.entity";

@Entity()
export class User extends BaseDBEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({default: 0})
  balance: number;

  @Column({ nullable: true })
  passportNumber: string;

  @Column()
  isMarried: boolean;

  @Column()
  dob: Date;

  @Column()
  status: UserStatus;

  @OneToMany(() => Wallet, (w) => w.owner, {
   // cascade: true
  })
  wallets: Wallet[]


  update(dto: any) {
    this.firstName = dto.firstName;
    this.dob = dto.dob;
  }
}

export enum UserStatus {
  active = "active",
  inactive = "inactive",
  notConfirmed = "not-confirmed",
}
