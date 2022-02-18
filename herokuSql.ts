import { Pool } from "pg";
import seedSql from "./seedSql";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sqlConnection = async () => {
  await seedSql(pool);

  await pool.end();
  console.log("Database Seeded");
};

sqlConnection();
