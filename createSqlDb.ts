const pgtools = require("pgtools");
import { Pool } from "pg";
import seedSql from "./seedSql"

const config = {
  user: "postgres",
  password: "password",
  port: 5432,
  host: "localhost",
};

pgtools.createdb(config, "backendTech", (err: Error, res: unknown) => {
  if (err) {
    if (err.name !== "duplicate_database") {
      process.exit(-1);
    }
  }

  const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "backendTech",
    password: "password",
    port: 5432,
  });
  
  const sqlConnection = async () => {
    await seedSql(pool);
  
    await pool.end();
    console.log("pool exit");
  };
  
  sqlConnection();
});

