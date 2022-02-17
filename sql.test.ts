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
});
