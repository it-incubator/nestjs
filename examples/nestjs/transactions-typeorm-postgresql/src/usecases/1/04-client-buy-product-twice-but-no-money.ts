import { Injectable, Scope } from '@nestjs/common';
import { DbService } from '../db.service';
import { Payment } from '../../entities/payment.entity';
import { delay, getUniqId } from '../delay';
import { Client } from '../../entities/client.entity';
import { registrateProvider } from '../../provider-registrator';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class ClientBuyProductTwiceButNoMoney {
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
      await this.dbService.clientsRepo
        .createQueryBuilder()
        .update()
        .set({ balance: () => 'balance - :price' })
        .setParameters({ price: product.price }) // Replace 1 with the desired increment value
        .where('id = :id', { id: client.id })
        .execute();

      product.availableQuantity--;
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
      throw error;
    }
  }
}
registrateProvider(ClientBuyProductTwiceButNoMoney);
