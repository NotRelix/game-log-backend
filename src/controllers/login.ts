import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../types/user.ts";
import { db } from "../db/drizzle.ts";
import { usersTable } from "../db/schema.ts";
import { and, eq } from "drizzle-orm";

const factory = createFactory();

export const loginUser = factory.createHandlers(
  zValidator("json", userSchema),
  async (c) => {
    const body = c.req.valid("json");

    const user = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.username, body.username),
          eq(usersTable.password, body.password)
        )
      );

    return c.json(user);
  }
);
