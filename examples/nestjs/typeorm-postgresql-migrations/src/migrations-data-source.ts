import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { options } from './db/options';

config();

const migrationOptions: DataSourceOptions = {
  ...options,
  migrations: [__dirname + '/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
} as DataSourceOptions;

export default new DataSource(migrationOptions);
