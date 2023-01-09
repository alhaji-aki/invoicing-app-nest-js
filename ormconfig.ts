import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource({
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
});
