import { createFactory } from "hono/factory";
import { db } from "../db/drizzle.ts";
import { usersTable } from "../db/schema.ts";

const factory = createFactory();

export const getUsers = factory.createHandlers(async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});

export const insertUser = factory.createHandlers(async (c) => {
  const mockUser: typeof usersTable.$inferInsert = {
    username: "reece",
    password: "password",
  };
  const user = await db.insert(usersTable).values(mockUser).returning();
  return c.json(user);
});
