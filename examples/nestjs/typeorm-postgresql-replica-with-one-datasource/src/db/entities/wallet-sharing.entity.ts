import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import {Wallet} from "./wallet.entity";
import {User} from "./user.entity";
import {WalletSharingLimit} from "./wallet-sharing-limit.entity";

@Entity()
export class WalletSharing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.walletSharings)
  wallet: Wallet;

  @ManyToOne(() => User, (user) => user.walletSharings)
  user: User;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  addedDate: Date;

  @Column({ type: 'smallint', nullable: true })
  status: number;

  @OneToOne(() => WalletSharingLimit, (limit) => limit.walletSharing)
  limit: WalletSharingLimit;
}
