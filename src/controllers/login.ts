import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators/user.ts";
import { getUser } from "../db/query.ts";
import bcrypt from "bcrypt";

const factory = createFactory();

export const loginUser = factory.createHandlers(
  zValidator("json", userSchema),
  async (c) => {
    const body = c.req.valid("json");
    const user = await getUser(body.username);
    const errorMessage = { error: "Invalid username or password" };
    if (!user) {
      return c.json(errorMessage);
    }
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      return c.json(errorMessage);
    }
    const { password, ...safeUser } = user;
    return c.json(safeUser);
  }
);
