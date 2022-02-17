import app from "./app";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import seedDb from "./seedDb";
import { connect, connection } from "mongoose";
import User from "./models/User";
import Post from "./models/Post";

const api = supertest(app);

let mongod: MongoMemoryServer;
describe("Testing mongo routes", () => {
  beforeAll(async () => {
    // Create db
    mongod = await MongoMemoryServer.create();
    await connect(mongod.getUri());
  });

  beforeEach(async () => {
    // Seed db
    await seedDb();
  });

  afterAll(async () => {
    // Stop db
    await connection.close();
    await mongod.stop();
  });

  it("Test users route gets users", async () => {
    const res = await api
      .get("/mongo/users")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body[0].name).toBe("Jack");
    expect(res.body[0].email).toBe("jack@email.com");
    expect(res.body[1].name).toBe("Jill");
  });

  it("Test users route gets a single user", async () => {
    const user = await User.findOne({});
    const id = user!._id.toString();
    const res = await api
      .get(`/mongo/users/${id}`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body.name).toBe("Jack");
    expect(res.body.email).toBe("jack@email.com");
  });

  it("Test posts route get posts", async () => {
    const res = await api
      .get("/mongo/posts")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body[0].title).toBe("Lorem Ipsum");
    expect(res.body[0].text).toBe("falksdf asdlkf jklasdfk jlasldkj fadsflk");
    expect(res.body[0].userId).not.toBeUndefined();
    expect(res.body[0].date).not.toBeUndefined();
  });

  it("Test posts route gets a single post", async () => {
    const post = await Post.findOne({});
    const id = post!._id.toString();
    const res = await api
      .get(`/mongo/posts/${id}`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body.title).toBe("Lorem Ipsum");
    expect(res.body.text).toBe("falksdf asdlkf jklasdfk jlasldkj fadsflk");
  });

  it("Test posts route adds a post", async () => {
    const user = await User.findOne({});
    const id = user!._id.toString();

    const res = await api
      .post("/mongo/posts")
      .send({
        userId: id,
        title: "Added title",
        text: "Added text",
      })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body.title).toBe("Added title");
    expect(res.body.text).toBe("Added text");

    const posts = await Post.find({});
    expect(posts.length).toBe(3);
  });

  it("Test posts route doesn't add with no text", async () => {
    const user = await User.findOne({});
    const id = user!._id.toString();

    const res = await api
      .post("/mongo/posts")
      .send({
        userId: id,
        title: "Added title",
      })
      .expect(400)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Text is required");

    const posts = await Post.find({});
    expect(posts.length).toBe(2);
  });

  it("Test posts route updates a post", async () => {
    const user = await User.findOne({});
    const userId = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId,
      title: "Added title",
      text: "Added text",
    });

    const postId = newPost.body._id;

    const res = await api
      .patch(`/mongo/posts/${postId}`)
      .send({ title: "Patched title", text: "Patched text", userId })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body.title).toBe("Patched title");
    expect(res.body.text).toBe("Patched text");
  });

  it("Test posts route doesn't update when no text or title", async () => {
    const user = await User.findOne({});
    const id = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId: id,
      title: "Added title",
      text: "Added text",
    });

    const postId = newPost.body._id;

    const res = await api
      .patch(`/mongo/posts/${postId}`)
      .expect(400)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Title is required");
  });

  it("Test posts update no userId supplied", async () => {
    const user = await User.findOne({});
    const id = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId: id,
      title: "Added title",
      text: "Added text",
    });

    const postId = newPost.body._id;

    const res = await api
      .patch(`/mongo/posts/${postId}`)
      .send({ title: "Patched title", text: "Patched text" })
      .expect(400)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("userId is required");
  });

  it("Test posts update wrong postId supplied", async () => {
    const user = await User.findOne({});
    const userId = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId,
      title: "Added title",
      text: "Added text",
    });

    const postId = newPost.body._id;

    const res = await api
      .patch(`/mongo/posts/${"0123456789ab"}`)
      .send({ title: "Patched title", text: "Patched text", userId })
      .expect(404)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Post not found");
  });

  it("Test posts can delete a post", async () => {
    const user = await User.findOne({});
    const userId = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId,
      title: "Added title",
      text: "Added text",
    });

    const postId = newPost.body._id;

    const res = await api
      .delete(`/mongo/posts/${postId}`)
      .send({ userId })
      .expect(204);

    const posts = await Post.find({});
    expect(posts.length).toBe(2);
  });

  it("Test posts can't delete a post if no userId", async () => {
    const user = await User.findOne({});
    const userId = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId,
      title: "Added title",
      text: "Added text",
    });

    const postId = newPost.body._id;

    const res = await api.delete(`/mongo/posts/${postId}`).expect(400);
    expect(res.text).toBe("userId is required");
  });

  it("Test posts can't delete a post if wrong userId", async () => {
    const user = await User.findOne({});
    const userId = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId,
      title: "Added title",
      text: "Added text",
    });

    const postId = newPost.body._id;

    const res = await api
      .delete(`/mongo/posts/${postId}`)
      .send({ userId: "453445344534453445344534" })
      .expect(401);

    expect(res.text).toBe("Not authorized");
  });

  it("Test posts can't delete a post if wrong postId", async () => {
    const user = await User.findOne({});
    const userId = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId,
      title: "Added title",
      text: "Added text",
    });

    const res = await api
      .delete(`/mongo/posts/${"0123456789ab"}`)
      .send({ userId })
      .expect(404);
  });
});

export default {};
