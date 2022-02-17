import { Pool } from "pg";

export default async (pool: Pool) => {
  try {
    await pool.query("DROP TABLE IF EXISTS posts");
    await pool.query("DROP TABLE IF EXISTS users");

    await pool.query(`CREATE TABLE users (
      id serial primary key,
      name varchar (100) not null,
      email varchar (255) unique not null,
      password varchar (100) not null)`);

    await pool.query(`CREATE TABLE posts (
      id serial primary key,
      user_id int not null REFERENCES users(id),
      title text not null,
      text text not null, 
      date timestamp not null
    )`);

    const users = [
      { name: "Bob", email: "bob@email.com", password: "bob" },
      { name: "Ben", email: "ben@email.com", password: "ben" },
    ];

    for (let user of users) {
      await pool.query(
        `INSERT INTO users(name, email, password) VALUES($1, $2, $3)`,
        [user.name, user.email, user.password]
      );
    }

    const posts = [
      {
        userId: 1,
        title: "Post 1 Title",
        text: "Post 1 Text",
        date: new Date(Date.now()),
      },
      {
        userId: 1,
        title: "Post 2 Title",
        text: "Post 2 Text",
        date: new Date(Date.now()),
      },
    ];

    for (let post of posts) {
      await pool.query(
        `INSERT INTO posts(user_id, title, text, date) VALUES($1, $2, $3, $4)`,
        [post.userId, post.title, post.text, post.date]
      );
    }
  } catch (error) {
    /* istanbul ignore next */
    console.log("SEEDING ERROR:", error);
  }
};
