import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

const options: any =
  process.env.NODE_ENV === 'production'
    ? { ssl: { rejectUnauthorized: false } }
    : {};
if (process.env.DEBUG) {
  options.debug = (connection, query, params, types) => {
    console.log(query, params, types);
  };
}
const sql = postgres(process.env.DATABASE_URL, options);

export default sql;
