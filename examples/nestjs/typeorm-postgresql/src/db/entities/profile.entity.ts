import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @ApiProperty()
    public bio: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn({
        //name: "userId"
    })
    public owner: User;

   // @Column()
   // public userId: number;
}

