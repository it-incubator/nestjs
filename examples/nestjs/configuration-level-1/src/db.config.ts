import { Global, Injectable } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';
import { validateConfig } from './utils/validation.utility';

@Global()
@Injectable()
export class DbConfig {
  @IsNumber()
  port: number = Number(process.env.PORT);

  @IsString({ message: 'Set value via ENV: MONGO_URL' })
  mongoURL: string = process.env.MONGO_URL;

  constructor() {
    validateConfig(this);
  }
}
