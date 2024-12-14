import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesManagerService {
  getHello(): string {
    return 'Hello World! from Files Manager';
  }
}
