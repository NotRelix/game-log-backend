import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../types/user.ts";
import { getUser } from "../db/query.ts";

const factory = createFactory();

export const loginUser = factory.createHandlers(
  zValidator("json", userSchema),
  async (c) => {
    const body = c.req.valid("json");
    const user = await getUser(body);
    return c.json(user);
  }
);
