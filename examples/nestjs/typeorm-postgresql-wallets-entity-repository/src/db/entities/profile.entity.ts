import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import {Client} from "./user.entity";
import { BaseDBEntity } from './baseDBEntity';

@Entity()
export class Profile extends BaseDBEntity {
  @Column({ type: 'varchar', nullable: true })
  hobby: string;

  @Column({ type: 'varchar', nullable: true })
  education: string;

  //если решим засорить юзера кошельками, то делаем навигационное обратное св-во
 // @OneToOne(() => Client, (user) => user.profile)
  // если хотим поставить ограничения или настройки
  @OneToOne(() => Client, (user) => user.profile, {
    nullable: false,
    //onDelete: '',
   // cascade:  true, //['insert', 'remove', 'soft-remove', 'update', 'recover']//true
  })
  // @OneToOne(() => Client, null, {
  //   nullable: false
  // })
  @JoinColumn()// сторона, которая должна иметь внешний ключ в таблице базы данных
  client: Client;
}

/*
user                           profile
id login email                 id address clientId
*/