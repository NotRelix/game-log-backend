import { createFactory } from "hono/factory";
import { db } from "../db/drizzle.ts";
import { usersTable } from "../db/schema.ts";
import { zValidator } from "@hono/zod-validator";
import { userSchema, type UserSchema } from "../types/user.ts";

const factory = createFactory();

export const getUsers = factory.createHandlers(async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});

export const insertUser = factory.createHandlers(
  zValidator("json", userSchema),
  async (c) => {
    const body = c.req.valid("json");

    const newUser: UserSchema = {
      username: body.username,
      password: body.password,
    };
    const user = await db.insert(usersTable).values(newUser).returning();

    return c.json(user);
  }
);
