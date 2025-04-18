import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import {Profile} from "./profile.entity";
import {Wallet} from "./wallet.entity";
import {WalletSharing} from "./wallet-sharing.entity";
import { BaseDBEntity } from './baseDBEntity';
import {InputWalletDto} from "../../example3-base-entity-special-columns/dto";
import {ForbiddenException} from "@nestjs/common";

@Entity()
export class Client extends BaseDBEntity{
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

    if (dto.status === 'vacation')
      if (this.wallets.some(w => w.balance < 0)) {
          throw Error('Client can go to vacation because has dept');
      }
  }

  static create(dto: any) {
    const client = new Client();

    client.firstName = dto.firstName;
    client.lastName = dto.lastName;
    client.status = 'not-confirmed';
    client.isMarried = dto.isMarried;
    client.dob = new Date(2000, 10, 1);

    client.profile = { // Profile.create
      hobby: 'it, js',
      education: 'it-incubator',
      // user: user // это можно не делать
    } as Profile

    client.wallets = [
      {
        title: 'Main wallet',
        currency: 'USD',
        balance: 1000,
        // owner: client // можем и нет смысла указывать
      } as Wallet
    ]
    return client;
  }

  // точно хотим засорять юзера профилем?
  @OneToOne(() => Profile, (profile) => profile.client, {
    cascade: true // благодаря этому мы можем сохраняя юзера применить изменения и на данную сущность
  })
  profile: Profile;

  // точно хотим засорять юзера кошельками?
  @OneToMany(() => Wallet, (wallet) => wallet.owner, {
    cascade: true // благодаря этому мы можем сохраняя юзера применить изменения и на данную сущность
  })
  wallets: Wallet[];

  // точно хотим засорять юзера кошельками?
  // @OneToMany(() => WalletSharing, (walletSharing) => walletSharing.user)
  // walletSharings: WalletSharing[];
  addNewWallet(createWalletDto: InputWalletDto) {
    // this.wallets = [];
    if (this.wallets.some(w => w.balance < 0)) {
      throw new ForbiddenException('User has negative balance and cannot create a new wallet');
    }

    const wallet = Wallet.create(createWalletDto)
    this.wallets.push(wallet)
    return wallet;
  }
}
