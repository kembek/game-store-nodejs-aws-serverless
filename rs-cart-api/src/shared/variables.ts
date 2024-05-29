import { ClientConfig } from 'pg';

const { DB_SERVER, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;

export const PG_CLIENT_CONFIG: ClientConfig = {
  host: DB_SERVER,
  port: parseInt(DB_PORT),
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
};
