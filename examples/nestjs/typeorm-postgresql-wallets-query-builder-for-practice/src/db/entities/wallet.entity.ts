import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
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

  @Column({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) // Use timestamptz
  lastTransactionAt: Date | null

  @ManyToOne(() => User, (user) => user.wallets)
  owner: User // {id: 2} as User
  @Column()
  ownerId: number

  @OneToMany(() => WalletSharing, (walletSharing) => walletSharing.wallet)
  walletSharings: WalletSharing[];
}



