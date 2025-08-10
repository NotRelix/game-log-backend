import { createFactory } from "hono/factory";
import { db } from "../db/drizzle.ts";
import { usersTable } from "../db/schema.ts";
import type { User } from "../types/user.ts";

const factory = createFactory();

export const getUsers = factory.createHandlers(async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});

export const insertUser = factory.createHandlers(async (c) => {
  const body = await c.req.json<User>();

  const newUser: User = { username: body.username, password: body.password };
  const user = await db.insert(usersTable).values(newUser).returning();

  return c.json(user);
});
