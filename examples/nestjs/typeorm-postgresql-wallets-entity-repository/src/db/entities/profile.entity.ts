import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import {User} from "./user.entity";
import { BaseDBEntity } from './baseDBEntity';

@Entity()
export class Profile extends BaseDBEntity {
  @Column({ type: 'varchar', nullable: true })
  hobby: string;

  @Column({ type: 'varchar', nullable: true })
  education: string;

  // если решим засорить юзера кошельками, то делаем навигационное обратное св-во
  // @OneToOne(() => User, (user) => user.profile)
  // если хотим поставить ограничения или настройки
  @OneToOne(() => User, (user) => user.profile, {
    nullable: false,
    //onDelete: '',
   // cascade: ['insert', 'remove', 'soft-remove', 'update', 'recover']//true
  })
  // @OneToOne(() => User)
  @JoinColumn() // сторона, которая должна иметь внешний ключ в таблице базы данных
  user: User;
}
