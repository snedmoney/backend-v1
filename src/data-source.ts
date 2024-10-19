import { DataSource } from 'typeorm';
import { Link } from './models/link';
import { TokenAccount } from './models/tokenAccount';
import { Transaction } from './models/transaction';
import { Wallet } from './models/wallet';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5431, // NOTE: Used a different port instead of 5432, might conflict with your own locally installed postgres
    username: 'postgres',
    // TODO: rotate the password and move it to env
    password: 'JkP%7NqgGGj8TGJz',
    database: 'postgres',
    synchronize: true,
    logging: true,
    entities: [Link, TokenAccount, Transaction, Wallet, Setting, '*.entity.js'],
    subscribers: [],
    migrations: [],
});
