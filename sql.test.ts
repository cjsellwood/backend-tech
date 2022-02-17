import supertest from "supertest";
import app from "./app";
import seedSql from "./seedSql";
import { Pool } from "pg";

const api = supertest(app);
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "backendTech",
  password: "password",
  port: 5432,
});
const query = (text: string, params: unknown[]) => pool.query(text, params);

describe("SQL routes testing", () => {
  beforeEach(async () => {
    await seedSql(pool);
  });

  it("Tests get users route", async () => {
    const res = await api
      .get("/sql/users")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body[0].id).toBe(1);
    expect(res.body[0].name).toBe("Bob");
    expect(res.body[0].email).toBe("bob@email.com");
    expect(res.body[1].name).toBe("Ben");
  });

  it("Test get posts route", async () => {
    const res = await api
      .get("/sql/posts")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body[0].id).toBe(1);
    expect(res.body[0].title).toBe("Post 1 Title");
    expect(res.body[0].text).toBe("Post 1 Text");
    expect(res.body[1].title).toBe("Post 2 Title");
  });

  describe("Add post route", () => {
    it("Adds a new post", async () => {
      const res = await api
        .post("/sql/posts")
        .send({ userId: 1, title: "Added Post Title", text: "Added Post Text" })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(res.body[0].title).toBe("Added Post Title");
      expect(res.body[0].text).toBe("Added Post Text");
      expect(res.body[0].userId).toBe(1);

      const posts = await query("SELECT * FROM posts", []);
      expect(posts.rows.length).toBe(3);
    });

    it("Doesn't add a post if no userId", async () => {
      const res = await api
        .post("/sql/posts")
        .send({ title: "Added Post Title", text: "Added Post Text" })
        .expect(400)
        .expect("Content-Type", /text/);

      expect(res.text).toBe("userId is required");

      const posts = await query("SELECT * FROM posts", []);
      expect(posts.rows.length).toBe(2);
    });

    it("Doesn't add a post if no title", async () => {
      const res = await api
        .post("/sql/posts")
        .send({ userId: 1, text: "Added Post Text" })
        .expect(400)
        .expect("Content-Type", /text/);

      expect(res.text).toBe("Title is required");

      const posts = await query("SELECT * FROM posts", []);
      expect(posts.rows.length).toBe(2);
    });

    it("Doesn't add a post if no text", async () => {
      const res = await api
        .post("/sql/posts")
        .send({ userId: 1, title: "Added Post Title" })
        .expect(400)
        .expect("Content-Type", /text/);

      expect(res.text).toBe("Text is required");

      const posts = await query("SELECT * FROM posts", []);
      expect(posts.rows.length).toBe(2);
    });
  });

  describe("Update post route", () => {
    it("Updates a post", async () => {
      const res = await api
        .patch("/sql/posts/1")
        .send({ title: "Updated Title", text: "Updated Text", userId: 1 })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(res.body[0].title).toBe("Updated Title");
      expect(res.body[0].text).toBe("Updated Text");

      const posts = await query("SELECT * FROM posts", []);
      expect(posts.rows.length).toBe(2);
    });

    it("Does not update a post when no title", async () => {
      const res = await api
        .patch("/sql/posts/1")
        .send({ text: "Updated Text", userId: 1 })
        .expect(400)
        .expect("Content-Type", /text/);

      expect(res.text).toBe("Title is required");
    });

    it("Does not update a post when no text", async () => {
      const res = await api
        .patch("/sql/posts/1")
        .send({ title: "Updated Title", userId: 1 })
        .expect(400)
        .expect("Content-Type", /text/);

      expect(res.text).toBe("Text is required");
    });

    it("Does not update a post when no userId", async () => {
      const res = await api
        .patch("/sql/posts/1")
        .send({ title: "Updated Title", text: "Updated Text" })
        .expect(400)
        .expect("Content-Type", /text/);

      expect(res.text).toBe("userId is required");
    });

    it("Does not update a post when wrong userId not posts author", async () => {
      const res = await api
        .patch("/sql/posts/1")
        .send({ userId: 9999, title: "Updated Title", text: "Updated Text" })
        .expect(401)
        .expect("Content-Type", /text/);

      expect(res.text).toBe("Not authorized");
    });

    it("Does not update a post when wrong post does not exist", async () => {
      const res = await api
        .patch("/sql/posts/9999")
        .send({ userId: 1, title: "Updated Title", text: "Updated Text" })
        .expect(404)
        .expect("Content-Type", /text/);

      expect(res.text).toBe("Post not found");
    });
  });

  describe("Delete post route", () => {
    it("Deletes a post", async () => {
      const res = await api
        .delete("/sql/posts/1")
        .send({ userId: 1 })
        .expect(204);

      const posts = await query(`SELECT * FROM posts`, []);
      expect(posts.rows.length).toBe(1);
    });

    it("Won't delete a post if no userId sent", async () => {
      const res = await api.delete("/sql/posts/1").expect(400);

      expect(res.text).toBe("userId is required");

      const posts = await query(`SELECT * FROM posts`, []);
      expect(posts.rows.length).toBe(2);
    });

    it("Won't delete a post if unauthorized userId", async () => {
      const res = await api
        .delete("/sql/posts/1")
        .send({ userId: 9999 })
        .expect(401);

      expect(res.text).toBe("Not authorized");

      const posts = await query(`SELECT * FROM posts`, []);
      expect(posts.rows.length).toBe(2);
    });

    it("Won't delete a post if post does not exist", async () => {
      const res = await api
        .delete("/sql/posts/9999")
        .send({ userId: 1 })
        .expect(404);

      expect(res.text).toBe("Post not found");

      const posts = await query(`SELECT * FROM posts`, []);
      expect(posts.rows.length).toBe(2);
    });
  });
});
