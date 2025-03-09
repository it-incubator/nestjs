import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import {Wallet} from "./wallet.entity";
import {Client} from "./user.entity";
import {WalletSharingLimit} from "./wallet-sharing-limit.entity";
import { BaseDBEntity } from './baseDBEntity';

@Entity()
export class WalletSharing extends BaseDBEntity {
 // @ManyToOne(() => Wallet, (wallet) => wallet.walletSharings)
  @ManyToOne(() => Wallet)
  wallet: Wallet;

  // если решим засорить юзера кошельками, то делаем навигационное обратное св-во
  // @ManyToOne(() => User, (user) => user.walletSharings)
  @ManyToOne(() => Client)
  user: Client;

  @Column({ type: 'smallint', nullable: true })
  status: number;

  @OneToOne(() => WalletSharingLimit, (limit) => limit.walletSharing)
  limit: WalletSharingLimit;
}
