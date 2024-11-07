import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { DbService } from '../db.service';
import { ClientBuyProductTwiceButPayOneWithTransaction } from './02-client-buy-product-twice-but-pay-one-with-transaction';
import { ClientBuyProductTwiceButPayOneWithTransactionIncrementalUpdates } from './03-client-buy-product-twice-but-pay-one-with-transaction-incremental-updates';
import { ClientBuyProductTwiceButNoMoney } from './04-client-buy-product-twice-but-no-money';
import { ClientCantBuyProductTwiceBecauseNoMoney } from './05-client-cant-buy-product-twice-because-no-money';
import { ClientCantBuyProductTwiceBecauseNoMoneyWithPessimisticLock } from './06-client-cant-buy-product-twice-because-no-money-with-pessimistic-lock';

describe('usecases', () => {
  let dbService: DbService;
  let app: TestingModule;

  function resolve<T>(type: new (...args: any[]) => T): Promise<T> {
    return app.resolve<T>(type);
  }

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dbService = await resolve(DbService);
  });

  describe('root', () => {
    it('incorrect behavior even with transaction"', async () => {
      await dbService.seed({
        clients: [{ id: 1, name: 'Dimych', balance: 2 }],
        products: [{ id: 1, title: 'IPhone', price: 1, availableQuantity: 10 }],
        payments: [],
      });

      // const useCase = app.get<ClientBuyProductTwiceButPayOne>(
      //   ClientBuyProductTwiceButPayOne,
      // );
      const useCase1 = await resolve(
        ClientBuyProductTwiceButPayOneWithTransaction,
      );
      const useCase2 = await resolve(
        ClientBuyProductTwiceButPayOneWithTransaction,
      );

      await Promise.all([useCase1.execute(), useCase2.execute()]);

      const client = await dbService.clientsRepo.findOneBy({ id: 1 });
      const payments = await dbService.paymentsRepo.find();
      const product = await dbService.productsRepo.findOneBy({ id: 1 });
      expect(client.balance).toBe(1);
      expect(payments.length).toBe(2);
      expect(product.availableQuantity).toBe(9);
    });

    it('correct behavior incremental updates"', async () => {
      await dbService.seed({
        clients: [{ id: 1, name: 'Dimych', balance: 2 }],
        products: [{ id: 1, title: 'IPhone', price: 1, availableQuantity: 10 }],
        payments: [],
      });

      // const useCase = app.get<ClientBuyProductTwiceButPayOne>(
      //   ClientBuyProductTwiceButPayOne,
      // );
      const useCase1 = await resolve(
        ClientBuyProductTwiceButPayOneWithTransactionIncrementalUpdates,
      );
      const useCase2 = await resolve(
        ClientBuyProductTwiceButPayOneWithTransactionIncrementalUpdates,
      );

      await Promise.all([useCase1.execute(), useCase2.execute()]);

      const client = await dbService.clientsRepo.findOneBy({ id: 1 });
      const payments = await dbService.paymentsRepo.find();
      const product = await dbService.productsRepo.findOneBy({ id: 1 });
      expect(client.balance).toBe(0);
      expect(payments.length).toBe(2);
      expect(product.availableQuantity).toBe(8);
    });

    it('correct behavior allow user to buy without money"', async () => {
      await dbService.seed({
        clients: [{ id: 1, name: 'Dimych', balance: 1 }],
        products: [{ id: 1, title: 'IPhone', price: 1, availableQuantity: 10 }],
        payments: [],
      });

      // const useCase = app.get<ClientBuyProductTwiceButPayOne>(
      //   ClientBuyProductTwiceButPayOne,
      // );
      const useCase1 = await resolve(ClientBuyProductTwiceButNoMoney);
      const useCase2 = await resolve(ClientBuyProductTwiceButNoMoney);

      await Promise.all([useCase1.execute(), useCase2.execute()]);

      const client = await dbService.clientsRepo.findOneBy({ id: 1 });
      const payments = await dbService.paymentsRepo.find();
      const product = await dbService.productsRepo.findOneBy({ id: 1 });
      expect(client.balance).toBe(-1);
      expect(payments.length).toBe(2);
      expect(product.availableQuantity).toBe(8);
    });

    it('optimistic lock prevent user to buy without money"', async () => {
      await dbService.seed({
        clients: [{ id: 1, name: 'Dimych', balance: 1 }],
        products: [{ id: 1, title: 'IPhone', price: 1, availableQuantity: 10 }],
        payments: [],
      });

      // const useCase = app.get<ClientBuyProductTwiceButPayOne>(
      //   ClientBuyProductTwiceButPayOne,
      // );
      const useCase1 = await resolve(ClientCantBuyProductTwiceBecauseNoMoney);
      const useCase2 = await resolve(ClientCantBuyProductTwiceBecauseNoMoney);

      await Promise.all([useCase1.execute(), useCase2.execute()]);

      const client = await dbService.clientsRepo.findOneBy({ id: 1 });
      const payments = await dbService.paymentsRepo.find();
      const product = await dbService.productsRepo.findOneBy({ id: 1 });
      expect(client.balance).toBe(0);
      expect(payments.length).toBe(1);
      expect(product.availableQuantity).toBe(9);
    });

    it('pessimistic lock prevent user to buy without money"', async () => {
      await dbService.seed({
        clients: [{ id: 1, name: 'Dimych', balance: 1 }],
        products: [{ id: 1, title: 'IPhone', price: 1, availableQuantity: 10 }],
        payments: [],
      });

      // const useCase = app.get<ClientBuyProductTwiceButPayOne>(
      //   ClientBuyProductTwiceButPayOne,
      // );
      const useCase1 = await resolve(
        ClientCantBuyProductTwiceBecauseNoMoneyWithPessimisticLock,
      );
      const useCase2 = await resolve(
        ClientCantBuyProductTwiceBecauseNoMoneyWithPessimisticLock,
      );

      await Promise.all([useCase1.execute(), useCase2.execute()]);

      const client = await dbService.clientsRepo.findOneBy({ id: 1 });
      const payments = await dbService.paymentsRepo.find();
      const product = await dbService.productsRepo.findOneBy({ id: 1 });
      expect(client.balance).toBe(0);
      expect(payments.length).toBe(1);
      expect(product.availableQuantity).toBe(9);
    });
  });
});
