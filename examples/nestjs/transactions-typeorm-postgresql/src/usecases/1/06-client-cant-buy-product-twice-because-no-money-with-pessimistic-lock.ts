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
export class ClientCantBuyProductTwiceBecauseNoMoneyWithPessimisticLock {
  constructor(private dbService: DbService) {
    this.instanceId =
      ++ClientCantBuyProductTwiceBecauseNoMoneyWithPessimisticLock.instancesCount;
  }
  readonly instanceId: number;
  static instancesCount = 0;
  async execute() {
    try {
      await this.dbService.startTransaction();
      const client = await this.dbService.clientsRepo.findOne({
        where: { id: 1 },
        lock: { mode: 'pessimistic_write' }, // equivalent to FOR UPDATE
      });
      const product = await this.dbService.productsRepo.findOneBy({ id: 1 });

      await delay(1000);

      if (client.balance < product.price) {
        throw new Error('No money');
      }

      client.balance = client.balance - product.price;
      await this.dbService.clientsRepo.save(client);

      product.availableQuantity--;
      await this.dbService.productsRepo.save(product);

      const newPayment = new Payment();
      newPayment.client = { id: client.id } as Client;
      newPayment.products = [product];
      newPayment.amount = product.price;
      newPayment.id = getUniqId();

      await this.dbService.paymentsRepo.save(newPayment);

      await this.dbService.commitTransaction();
    } catch (error) {
      debugger;
      await this.dbService.rollbackTransaction();
      throw error;
    }
  }
}

registrateProvider(ClientCantBuyProductTwiceBecauseNoMoneyWithPessimisticLock);
