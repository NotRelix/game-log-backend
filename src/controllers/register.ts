import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema, type UserSchema } from "../types/user.ts";
import { db } from "../db/drizzle.ts";
import { usersTable } from "../db/schema.ts";

const factory = createFactory();

export const registerUser = factory.createHandlers(
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
