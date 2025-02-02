import {BaseDBEntity} from "./baseDBEntity";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class Wallet extends BaseDBEntity {
    @Column()
    balance: number;

    @Column()
    title: string;

    @ManyToOne(() => User, (u) => u.wallets, {
        nullable: false,
        //eager: true
    })
    // @JoinColumn({
    //     name: 'ownerId'
    // })
    owner: User;


    static create(title) {
        const wallet = new Wallet();
        wallet.title = title;
        wallet.balance = 0;
        return wallet;
    }
    // @Column()
    // ownerId: number;
}