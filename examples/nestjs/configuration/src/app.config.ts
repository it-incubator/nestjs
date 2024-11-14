import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { validateConfig } from './utils/validation.utility';

@Injectable()
export class AppConfig {
  @IsNumber()
  port: number = Number(this.configService.get<number>('PORT'));

  @IsString({ message: 'Set value via ENV: MONGO_URL' })
  mongoURL: string = this.configService.get<string>('MONGO_URL');

  constructor(private configService: ConfigService) {
    validateConfig(this);
  }
}
