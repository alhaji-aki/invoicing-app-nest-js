import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  name: 'default',
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/db/migrations/*.js'],
  seeds: ['dist/src/db/seeders/*.js'],
  factories: ['dist/src/db/factories/*.js'],
};

export const dataSource = new DataSource(options);
