import app from "./app";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import seedDb from "./seedDb";
import {
  connect,
  connection,
  disconnect,
  isValidObjectId,
  Mongoose,
} from "mongoose";
import User from "./models/User";
import Post from "./models/Post";

const api = supertest(app);

test("Test home route", async () => {
  const res = await api.get("/").expect(200).expect("Content-Type", /text/);

  expect(res.text).toBe("1. Hello World!");
});

describe("Testing /test route", () => {
  test("Testing home route", async () => {
    const res = await api
      .get("/test/")
      .expect(200)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Testing route");
  });

  test("Testing time route", async () => {
    const res = await api
      .get("/test/time")
      .expect(200)
      .expect("Content-Type", /text/);

    expect(res.text).toEqual(
      expect.stringMatching(/\d{1,2}:\d{2}:\d{2} [ap]m/)
    );
  });

  test("Test users route", async () => {
    const res = await api
      .get("/test/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual([
      { id: 1, name: "Bob" },
      { id: 2, name: "Bill" },
    ]);
  });

  test("Test error route", async () => {
    const res = await api
      .get("/test/error")
      .expect(404)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Test Error");
  });

  test("Test async error route", async () => {
    const res = await api
      .get("/test/asyncError")
      .expect(405)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Async Error");
  });

  test("Test login route for successful login", async () => {
    const res = await api
      .post("/test/login")
      .send({ username: "Bob", password: "password" })
      .expect(200)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Logged In");
  });

  test("Test login route for incorrect credentials", async () => {
    const res = await api
      .post("/test/login")
      .send({ username: "Bill", password: "password" })
      .expect(404)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Credentials are incorrect");
  });
});

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

    expect(res.text).toBe("No title or text");
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
      .expect(401)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Needs userId");
  });

  it("Test posts update wrong userId supplied", async () => {
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
      .send({ title: "Patched title", text: "Patched text", userId: "1463" })
      .expect(401)
      .expect("Content-Type", /text/);

    expect(res.text).toBe("Not authorized");
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

    const res = await api.delete(`/mongo/posts/${postId}`).expect(401);
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
      .send({ userId: "4534" })
      .expect(401);
  });

  it("Test posts can't delete a post if wrong postId", async () => {
    const user = await User.findOne({});
    const userId = user!._id.toString();

    const newPost = await api.post("/mongo/posts").send({
      userId,
      title: "Added title",
      text: "Added text",
    });

    const postId = newPost.body._id;

    const res = await api
      .delete(`/mongo/posts/${"0123456789ab"}`)
      .send({ userId })
      .expect(404);
  });
});

export default {};
