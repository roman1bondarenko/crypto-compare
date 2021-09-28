import {createConnection} from 'typeorm';

import {Price} from '../entities/price';
import {RawPrice} from '../entities/rawPrice';
import {DisplayPrice} from '../entities/displayPrice';

export async function getDbConnection() {
  const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT } = process.env;

  const entities = [Price, RawPrice, DisplayPrice];

  return createConnection({
    type: 'mysql',
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    synchronize: true,
    entities,
  });
}
