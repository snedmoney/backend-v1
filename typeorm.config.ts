module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5431, // NOTE: Used a different port instead of 5432, might conflict with your own locally installed postgres
  username: process.env.DB_USERNAME ?? 'dev',
  // TODO: rotate the password and move it to env
  password: 'JkP%7NqgGGj8TGJz',
  database: 'postgres',
  synchronize: true,
  logging: true,
  entities: ['src/models/**/*.{ts,js}'],
  subscribers: [],
  migrations: [],
};