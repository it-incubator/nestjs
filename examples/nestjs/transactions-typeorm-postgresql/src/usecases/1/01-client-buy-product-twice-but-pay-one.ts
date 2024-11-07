import { Injectable } from '@nestjs/common';
import { DbService } from '../db.service';
import { Payment } from '../../entities/payment.entity';
import { delay, getUniqId } from '../delay';
import { Client } from '../../entities/client.entity';
import { registrateProvider } from '../../provider-registrator';

@Injectable()
export class ClientBuyProductTwiceButPayOne {
  constructor(private dbService: DbService) {}
  async execute() {
    const client = await this.dbService.clientsRepo.findOneBy({ id: 1 });
    const product = await this.dbService.productsRepo.findOneBy({ id: 1 });

    await delay(1000);
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
  }
}
registrateProvider(ClientBuyProductTwiceButPayOne);
