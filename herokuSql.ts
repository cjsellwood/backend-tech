import { Pool } from "pg";
import seedSql from "./seedSql";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const sqlConnection = async () => {
  await seedSql(pool);

  await pool.end();
  console.log("Database Seeded");
};

sqlConnection();
