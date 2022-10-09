import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DB_NAME, DB_HOST, DB_PASS } = process.env;

const config = {
  user: DB_NAME,
  database: DB_NAME,
  password: DB_PASS,
  host: DB_HOST,
};

const { Pool } = pkg;
const pool = new Pool(config);

export default pool;
