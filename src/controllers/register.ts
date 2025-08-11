import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../types/user.ts";
import { insertUser } from "../db/query.ts";

const factory = createFactory();

export const registerUser = factory.createHandlers(
  zValidator("json", userSchema),
  async (c) => {
    const body = c.req.valid("json");
    const user = await insertUser(body);
    return c.json(user);
  }
);
