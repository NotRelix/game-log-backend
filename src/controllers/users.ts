import { createFactory } from "hono/factory";
import { db } from "../db/drizzle.ts";
import { usersTable } from "../db/schema.ts";

const factory = createFactory();

export const getUsers = factory.createHandlers(async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});
