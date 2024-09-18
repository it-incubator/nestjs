import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import {Profile} from "./profile.entity";
import {Wallet} from "./wallet.entity";
import {WalletSharing} from "./wallet-sharing.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  passportNumber: string;

  @Column({ type: 'boolean', nullable: true })
  isMarried: boolean;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Wallet, (wallet) => wallet.owner)
  wallets: Wallet[];

  @OneToMany(() => WalletSharing, (walletSharing) => walletSharing.user)
  walletSharings: WalletSharing[];
}
