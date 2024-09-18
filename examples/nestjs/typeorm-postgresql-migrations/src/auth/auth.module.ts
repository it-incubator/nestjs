import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './db/account.entity';
import { AuthController } from './auth.controller';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => FinanceModule),
  ],
  controllers: [AuthController],
  exports: [TypeOrmModule],
})
export class AuthModule {}
