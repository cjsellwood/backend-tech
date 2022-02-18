import { connect, connection } from "mongoose";
import seedDb from "./seedDb";
import dotenv from "dotenv";
dotenv.config();

async function main(uri: string) {
  await connect(uri);
  await seedDb();
  connection.close();
}

main(process.env.MONGO_URI!).catch((err) => console.log(err));
