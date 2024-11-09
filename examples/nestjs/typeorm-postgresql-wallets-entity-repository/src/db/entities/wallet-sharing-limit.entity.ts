import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WalletSharing } from './wallet-sharing.entity';

@Entity()
export class WalletSharingLimit {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'integer', nullable: true })
    limitPerDay: number;

    @Column({ type: 'integer', nullable: true })
    limitPerWeek: number;

    @Column({ type: 'integer', nullable: true })
    limitPerMonth: number;

    @OneToOne(() => WalletSharing, (walletSharing) => walletSharing.limit)
    walletSharing: WalletSharing;
}
