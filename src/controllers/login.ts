import { createFactory } from "hono/factory";
import { userSchema } from "../validators/user.ts";
import { getUserDb } from "../db/query.ts";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { validator } from "../middleware/validator.ts";

const factory = createFactory();

export const loginUserHandler = factory.createHandlers(
  validator(userSchema),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const user = await getUserDb(body.username);
      const errorMessage = {
        success: false,
        messages: ["Invalid username or password"],
      };
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
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 60 seconds * 60 minutes * 24 hours = 1 day
      };
      const token = await sign(payload, process.env.JWT_SECRET!);
      const { password, ...safeUser } = user;
      return c.json(
        {
          success: true,
          messages: ["Successfully logged in"],
          token,
          user: safeUser,
        },
        200
      );
    } catch (err) {
      return c.json(
        { success: false, messages: ["Failed to login user"] },
        500
      );
    }
  }
);
