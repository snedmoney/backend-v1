import { DataSource } from 'typeorm';
import { TokenAccount } from '@/models/tokenAccount';

let AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'JkP%7NqgGGj8TGJz',
  database: 'postgres',
  synchronize: true,
  logging: true,
  entities: [TokenAccount],
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
