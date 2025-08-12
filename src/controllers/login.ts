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
        return c.json(errorMessage, 401);
      }
      const isPasswordMatch = await bcrypt.compare(
        body.password,
        user.password
      );
      if (!isPasswordMatch) {
        return c.json(errorMessage, 401);
      }
      const payload = {
        id: user.id,
        username: user.username,
        role: user.roleId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 60 seconds * 60 minutes = 1 Hour
      };
      const token = await sign(payload, process.env.JWT_SECRET!);
      const { password, ...safeUser } = user;
      return c.json({ token, user: safeUser }, 200);
    } catch (err) {
      return c.json({ error: "Failed to login user" }, 500);
    }
  }
);
