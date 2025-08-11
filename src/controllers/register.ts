import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators/user.ts";
import { insertUser } from "../db/query.ts";
import type { InsertUser } from "../db/types.ts";
import bcrypt from "bcrypt";

const factory = createFactory();

export const registerUser = factory.createHandlers(
  zValidator("json", userSchema),
  async (c) => {
    const body = c.req.valid("json");
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser: InsertUser = {
      username: body.username,
      password: hashedPassword,
    };
    const user = await insertUser(newUser);
    return c.json(user);
  }
);
