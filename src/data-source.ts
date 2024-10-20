import { DataSource } from 'typeorm';
import { Link } from './models/link';
import { TokenAccount } from './models/tokenAccount';
import { Transaction } from './models/transaction';
import { Wallet } from './models/wallet';
import { Setting } from './models/setting';
import { ChainInfo } from './models/chain';

// This needs to be a singleton and initialize once
let AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: 5431, // NOTE: Used a different port instead of 5432, might conflict with your own locally installed postgres
  username: 'dev',
  // TODO: rotate the password and move it to env
  password: 'JkP%7NqgGGj8TGJz',
  database: 'postgres',
  synchronize: true,
  logging: true,
  entities: [Link, TokenAccount, Transaction, Wallet, Setting, ChainInfo],
  subscribers: [],
  migrations: [],
});

export async function initializeDataSource() {
  await AppDataSource.initialize();
}

export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    AppDataSource = await AppDataSource.initialize();
  }

  return AppDataSource;
}
