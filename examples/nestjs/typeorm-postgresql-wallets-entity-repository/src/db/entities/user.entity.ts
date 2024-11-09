import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import {Profile} from "./profile.entity";
import {Wallet} from "./wallet.entity";
import {WalletSharing} from "./wallet-sharing.entity";
import { BaseDBEntity } from './baseDBEntity';

@Entity()
export class User extends BaseDBEntity{
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable: true })
  passportNumber: string;

  @Column()
  isMarried: boolean;

  @Column()
  dob: Date;

  @Column()
  status: string;

  update(dto: any){
    if (dto.isMarried && !dto.passportNumber) {
      throw new Error('Passport must have if merried')
    }

    this.firstName = dto.firstName;
    this.lastName = dto.lastName;

    this.passportNumber = dto.passportNumber;
    this.isMarried = dto.isMarried;
  }

  static create(dto: any) {
    const user = new User();
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.status = 'not-confirmed';
    user.isMarried = dto.isMarried;
    user.dob = new Date(2000, 10, 1);

    user.profile = { // Profile.create
      hobby: 'it, js',
      education: 'it-incubator',
      user: user
    } as Profile
    user.wallets = [
      {
        title: 'Main wallet',
        currency: 'USD',
        balance: 1000,
        owner: user
      } as Wallet
    ]


    return user;
  }

  // точно хотим засорять юзера профилем?
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true
  })
  profile: Profile;

  // точно хотим засорять юзера кошельками?
  @OneToMany(() => Wallet, (wallet) => wallet.owner, {
    cascade: true
  })
  wallets: Wallet[];

  // точно хотим засорять юзера кошельками?
  // @OneToMany(() => WalletSharing, (walletSharing) => walletSharing.user)
  // walletSharings: WalletSharing[];
}
