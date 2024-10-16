import { DataSource } from 'typeorm';
import { Link } from './models/link';
import { TokenAccount } from './models/tokenAccount';
import { Transaction } from './models/transaction';
import { Wallet } from './models/wallet';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  // TODO: rotate the password and move it to env
  password: 'JkP%7NqgGGj8TGJz',
  database: 'postgres',
  synchronize: true,
  logging: true,
  entities: [Link, TokenAccount, Transaction, Wallet],
  subscribers: [],
  migrations: [],
});
