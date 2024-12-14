import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "./user.entity";
import {WalletSharing} from "./wallet-sharing.entity";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'char', length: 3, nullable: true })
  currency: string;

  @Column()
  balance: number;

  @Column()
  addedAt: Date;

  @ManyToOne(() => User, (user) => user.wallets)
  owner: User;

  @OneToMany(() => WalletSharing, (walletSharing) => walletSharing.wallet)
  walletSharings: WalletSharing[];
}



