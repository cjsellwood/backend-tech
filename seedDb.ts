import User from "./models/User";
import Post from "./models/Post";

export default async () => {
  // Clear database
  await User.deleteMany({});
  await Post.deleteMany({});

  // Insert starting users
  await User.insertMany([
    { name: "Jack", email: "jack@email.com", password: "Jack" },
    { name: "Jill", email: "jill@email.com", password: "Jill" },
  ]);

  // Insert starting posts
  const a = await User.find({});
  const userId = a[0]._id;

  await Post.insertMany([
    {
      userId: userId,
      title: "Lorem Ipsum",
      text: "falksdf asdlkf jklasdfk jlasldkj fadsflk",
      date: new Date(Date.now()),
    },
    {
      userId: userId,
      title: "Ipsum Lorem",
      text: "xznmvbzmncv bzxcbnm vmzxncb vmnz xbcvmnbz vxv",
      date: new Date(Date.now()),
    },
  ]);
};
