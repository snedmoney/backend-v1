import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5431,
    username: 'postgres',
    password: 'JkP%7NqgGGj8TGJz',
    database: 'postgres',
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
});
