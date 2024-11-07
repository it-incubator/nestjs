import { Injectable, Scope } from '@nestjs/common';
import { DbService } from '../db.service';
import { Payment } from '../../entities/payment.entity';
import { delay, getUniqId } from '../delay';
import { Client } from '../../entities/client.entity';
import { QueryFailedError } from 'typeorm';
import { registrateProvider } from '../../provider-registrator';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class ClientCantBuyProductTwiceBecauseNoMoney {
  constructor(private dbService: DbService) {}

  async execute() {
    try {
      await this.dbService.startTransaction();
      const client = await this.dbService.clientsRepo.findOneBy({ id: 1 });
      const product = await this.dbService.productsRepo.findOneBy({ id: 1 });

      await delay(1000);
      if (client.balance < product.price) {
        throw new Error('No money');
      }

      // client.balance = client.balance - product.price;
      await this.dbService.queryRunner.query(`
    DO $$
    DECLARE
        balance_deduction NUMERIC := ${product.price};
        client_id NUMERIC := '${client.id}';
        prev_balance NUMERIC := ${client.balance};
    BEGIN
        UPDATE client
        SET balance = balance - balance_deduction
        WHERE id = client_id AND balance = prev_balance;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'No rows were updated. Possible concurrency issue or insufficient balance.';
        END IF;
    END $$;
`);
      await delay(1000);
      await this.dbService.productsRepo
        .createQueryBuilder()
        .update()
        .set({ availableQuantity: () => 'availableQuantity - 1' })
        .where('id = :id', { id: product.id })
        .execute();

      const newPayment = new Payment();
      newPayment.client = { id: client.id } as Client;
      newPayment.products = [product];
      newPayment.amount = product.price;
      newPayment.id = getUniqId();

      await this.dbService.paymentsRepo.save(newPayment);

      await this.dbService.commitTransaction();
    } catch (error) {
      await this.dbService.rollbackTransaction();
      if (error instanceof QueryFailedError) {
        return this.execute();
      }
      console.error(error);
    }
  }
}
registrateProvider(ClientCantBuyProductTwiceBecauseNoMoney);
