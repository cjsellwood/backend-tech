import { Date, Schema, Types, model } from "mongoose";

interface Post {
  userId: Types.ObjectId;
  title: string;
  text: string;
  date: Date;
}
const schema = new Schema<Post>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
});

export default model<Post>("Post", schema);
