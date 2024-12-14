import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayCoreService {
  getHello(): string {
    return 'Hello World from gateway!!!';
  }
}
