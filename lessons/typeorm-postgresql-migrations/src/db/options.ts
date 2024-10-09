import { DataSourceOptions } from 'typeorm';

export const options: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'it-incubator.io',
  database: 'TypeOrmMigrationLesson',
  //database: 'TypeOrmMigrationNew',
  //synchronize: false,
  logging: true,
};
