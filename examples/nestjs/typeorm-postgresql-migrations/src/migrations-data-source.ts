import { config } from 'dotenv';
import { envFilePaths } from './env-file-paths';
config({
  path: envFilePaths,
});
import { DataSource, DataSourceOptions } from 'typeorm';
import { options } from './db/options';

const migrationOptions: DataSourceOptions = {
  ...options,
  migrations: [__dirname + '/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
} as DataSourceOptions;

export default new DataSource(migrationOptions);
