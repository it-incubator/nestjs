import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import {WalletSharing} from "./wallet-sharing.entity";

@Entity()
export class WalletSharingLimit {
    @PrimaryColumn('uuid')
    walletSharingId: string;

    @Column({ type: 'integer', nullable: true })
    limitPerDay: number;

    @Column({ type: 'integer', nullable: true })
    limitPerWeek: number;

    @Column({ type: 'integer', nullable: true })
    limitPerMonth: number;

    @OneToOne(() => WalletSharing, (walletSharing) => walletSharing.limit)
    walletSharing: WalletSharing;
}
