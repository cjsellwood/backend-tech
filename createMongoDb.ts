import User from "./models/User";
import Post from "./models/Post";
import mongoose, { connect, connection } from "mongoose";
import seedDb from "./seedDb";

async function main(uri: string) {
  await connect(uri);
}

main("mongodb://localhost:27017/backendTest").catch((err) => console.log(err));

seedDb();

connection.close();
