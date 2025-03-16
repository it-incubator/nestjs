import { DataSourceOptions } from 'typeorm';

console.log('OPTIONS.TS >>>>>>>>>>>>>>>>>>');

console.log(process.env.POSTGRE_USER_PASSWORD);
console.log(process.env.NODE_ENV);

export const options: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5532,
  username: process.env.POSTGRE_USER_NAME,
  password: process.env.POSTGRE_USER_PASSWORD,
  database: process.env.POSTGRE_DB_NAME, // 'TypeOrmMigrationLesson',
  //database: 'TypeOrmMigrationNew',
  synchronize: true, // process.env.DB_AUTOSYNC, // turn on for .env.testing,  но желательно
  // чтобы тестовый сервер (Gitlab CI, Jenkins чтобы он переопределяли эту настройку на false
  // и накатывал миграции
  logging: true, // process.env.DB_LOGGING_LEVEL
};
