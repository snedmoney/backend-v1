import { PaymentMethod, Token, User } from './models';

import { Chain } from './models/chain';
import { DataSource } from 'typeorm';
import { Link } from './models/link';
import { Social } from './models/social';
import { Transaction } from './models/transaction';
import { Wallet } from './models/wallet';

// import { Wallet } from './models/wallet';
// import { Setting } from './models/setting';
// import { ChainInfo } from './models/chain';

// This needs to be a singleton and initialize once
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5431, // NOTE: Used a different port instead of 5432, might conflict with your own locally installed postgres
    username: process.env.DB_USERNAME ?? 'dev',
    // TODO: rotate the password and move it to env
    password: process.env.DB_PASSWORD ?? 'JkP%7NqgGGj8TGJz',
    database: 'postgres',
    synchronize: true,
    logging: true,
    entities: [Token, Chain, Wallet, User, Transaction, Link, PaymentMethod, Social],
    subscribers: [],
    migrations: [],
});