import app from "./app";
import supertest from "supertest";

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
});

export default {};
