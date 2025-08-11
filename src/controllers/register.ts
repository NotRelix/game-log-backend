import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators/user.ts";
import { getUser, insertUser } from "../db/query.ts";
import type { InsertUser } from "../db/types.ts";
import bcrypt from "bcrypt";

const factory = createFactory();

export const registerUser = factory.createHandlers(
  zValidator("json", userSchema),
  async (c) => {
    const body = c.req.valid("json");
    const user = await getUser(body.username);
    if (user) {
      return c.json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser: InsertUser = {
      username: body.username,
      password: hashedPassword,
    };
    const newUserResult = await insertUser(newUser);
    if (!newUserResult) {
      return c.json({ error: "Something went wrong creating the user" });
    }
    const { password, ...safeUser } = newUserResult;
    return c.json(safeUser);
  }
);
