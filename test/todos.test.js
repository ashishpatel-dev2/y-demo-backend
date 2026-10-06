// API tests against a real PostgreSQL database.
// Needs the DB_* env vars and `npm run db:setup` to have run first
// (GitHub Actions does both; locally see README).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { pool } from "../src/db.js";

before(async () => {
  await pool.query("TRUNCATE todos RESTART IDENTITY");
});

after(async () => {
  await pool.end();
});

test("GET /api/health reports ok", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: "ok" });
});

test("POST /api/todos creates a todo", async () => {
  const res = await request(app).post("/api/todos").send({ title: "  Buy milk  " });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, "Buy milk");
  assert.equal(res.body.completed, false);
});

test("POST /api/todos rejects an empty title", async () => {
  const res = await request(app).post("/api/todos").send({ title: "   " });
  assert.equal(res.status, 400);
});

test("GET /api/todos lists todos, newest first", async () => {
  await request(app).post("/api/todos").send({ title: "Second" });
  const res = await request(app).get("/api/todos");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.map((t) => t.title), ["Second", "Buy milk"]);
});

test("PUT /api/todos/:id updates completed", async () => {
  const res = await request(app).put("/api/todos/1").send({ completed: true });
  assert.equal(res.status, 200);
  assert.equal(res.body.completed, true);
  assert.equal(res.body.title, "Buy milk");
});

test("PUT /api/todos/:id returns 404 for a missing todo", async () => {
  const res = await request(app).put("/api/todos/9999").send({ completed: true });
  assert.equal(res.status, 404);
});

test("DELETE /api/todos/:id removes the todo", async () => {
  const del = await request(app).delete("/api/todos/1");
  assert.equal(del.status, 204);
  const again = await request(app).delete("/api/todos/1");
  assert.equal(again.status, 404);
});
