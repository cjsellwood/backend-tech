import { connect, connection } from "mongoose";
import seedDb from "./seedDb";

async function main(uri: string) {
  await connect(uri);
  await seedDb();
  connection.close();
}

main("mongodb://localhost:27017/backendTest").catch((err) => console.log(err));
