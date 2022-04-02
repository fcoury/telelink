import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

const sql =
  process.env.NODE_ENV === 'production'
    ? postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } })
    : postgres(process.env.DATABASE_URL);

export default sql;
