import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators/user.ts";
import { getUser } from "../db/query.ts";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";

const factory = createFactory();

export const loginUser = factory.createHandlers(
  zValidator("json", userSchema),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const user = await getUser(body.username);
      const errorMessage = { error: "Invalid username or password" };
      if (!user) {
        return c.json(errorMessage);
      }
      const isPasswordMatch = await bcrypt.compare(
        body.password,
        user.password
      );
      if (!isPasswordMatch) {
        return c.json(errorMessage);
      }
      const payload = {
        id: user.id,
        username: user.username,
        role: "regular",
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
      };
      const token = await sign(payload, process.env.JWT_SECRET!);
      const { password, ...safeUser } = user;
      return c.json({ token, user: safeUser });
    } catch (err) {
      return c.json({ error: "Failed to login user: ", err });
    }
  }
);
