import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { WalletSharing } from './wallet-sharing.entity';
import { BaseDBEntity } from './baseDBEntity';
import {InputWalletDto} from "../../example3-base-entity-special-columns/dto";

@Entity()
export class Wallet extends BaseDBEntity {
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

  /**
   * Static factory method;
   * Фабричный статический метод фактически это более наворочення версия конструктора.
   * @param dto
   */
  static create(dto: InputWalletDto): Wallet {
    const bonus = 100;

    const wallet = new Wallet();

    wallet.balance = dto.balance + bonus;
    wallet.title = dto.title;
    wallet.currency = dto.currency;
    wallet.owner = {id: dto.ownerId} as User;

    return wallet;
  }
}