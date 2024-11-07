import { Injectable, Scope } from '@nestjs/common';
import { Client } from '../entities/client.entity';
import { Payment } from '../entities/payment.entity';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { registrateProvider } from '../provider-registrator';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class DbService {
  public queryRunner: QueryRunner = null;
  constructor(
    @InjectRepository(Client) private _clientsRepo: Repository<Client>,
    @InjectRepository(Product) private _productsRepo: Repository<Product>,
    @InjectRepository(Payment) private _paymentsRepo: Repository<Payment>,
    private dataSource: DataSource,
  ) {}

  get clientsRepo() {
    if (this.queryRunner !== null) {
      return this.queryRunner.manager.getRepository(Client);
    } else {
      return this._clientsRepo;
    }
  }
  get productsRepo() {
    if (this.queryRunner !== null) {
      return this.queryRunner.manager.getRepository(Product);
    } else {
      return this._productsRepo;
    }
  }
  get paymentsRepo() {
    if (this.queryRunner !== null) {
      return this.queryRunner.manager.getRepository(Payment);
    } else {
      return this._paymentsRepo;
    }
  }

  async seed(command: {
    clients: Client[];
    products: Product[];
    payments: Payment[];
    // Assuming products are represented differently in the command object
  }) {
    await this._paymentsRepo.delete({});
    await this._productsRepo.delete({});
    await this._clientsRepo.delete({});

    await this._clientsRepo.insert(command.clients);
    await this._productsRepo.insert(command.products);
    await this._paymentsRepo.insert(command.payments);
  }

  async startTransaction() {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    return this.queryRunner;
  }

  async commitTransaction() {
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
    this.queryRunner = null;
  }

  async rollbackTransaction() {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    this.queryRunner = null;
  }
}

registrateProvider(DbService);
