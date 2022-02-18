import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

let pool: Pool;
if (process.env.NODE_ENV !== "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

export const query = (text: string, params: unknown[]) =>
  pool.query(text, params);
