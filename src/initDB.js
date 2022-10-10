import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();

const { DB_NAME, DB_HOST, DB_PASS } = process.env;

const pgp = pgPromise({});

const db = pgp(`postgres://${DB_NAME}:${DB_PASS}@${DB_HOST}/${DB_NAME}`);

export default db;
