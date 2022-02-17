import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "backendTech",
  password: "password",
  port: 5432,
});

export const query = (text: string, params: unknown[]) =>
  pool.query(text, params);
