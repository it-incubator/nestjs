import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private isHasRightStrategy: () => boolean) {}

  totallyRemoveUser() {
    if (this.isHasRightStrategy()) {
      console.log('USER WILL BE DELETED');
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
