import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Profile} from "./profile.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    @ApiProperty()
    name: string;

    @Column('text')
    @ApiProperty()
    description: string;

    @Column('int')
    views: number;

    @Column()
    status: UserStatus;

    @Column({ nullable: true })
    public email: string | null;

    @Column({ nullable: true })
    public tel: string | null;

    @OneToOne((type) => Profile, (profile) => profile.owner)
    public profile: Profile;
}

export enum UserStatus {
    NotValidated = 'NotValidated',
    Validated = 'Validated',
    Blocked = 'Blocked'
}


