import { Expose } from 'class-transformer';

export class UserViewModel {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;
}