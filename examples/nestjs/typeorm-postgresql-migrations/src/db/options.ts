import { DataSourceOptions } from 'typeorm';

export const options: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'it-incubator.io',
  database: 'TypeOrmMigrationLesson',
  //database: 'TypeOrmMigrationNew',
  synchronize: false, // process.env.DB_AUTOSYNC, // turn on for .env.testing,  но желательно
  // чтобы тестовый сервер (Gitlab CI, Jenkins чтобы он переопределяли эту настройку на false
  // и накатывал миграции
  logging: true, // process.env.DB_LOGGING_LEVEL
};
