import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { WalletSharing } from './wallet-sharing.entity';
import { BaseDBEntity } from './baseDBEntity';

@Entity()
export class Wallet  extends BaseDBEntity {
  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'char', length: 3, nullable: true })
  currency: string;

  @Column()
  balance: number;

  // если решим засорить юзера кошельками, то делаем навигационное обратное св-во
  // @ManyToOne(() => User, (user) => user.wallets)
  // If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity.
  @ManyToOne(() => User, null, {
    nullable: false
  })
  owner: User;

  //@OneToMany(() => WalletSharing, (walletSharing) => walletSharing.wallet)
  //walletSharings: WalletSharing[];
}