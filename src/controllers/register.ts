import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators/user.ts";
import { getUserDb, insertUserDb } from "../db/query.ts";
import type { InsertUser } from "../db/types.ts";
import bcrypt from "bcrypt";
import type { ZodIssue } from "zod/v3";

const factory = createFactory();

export const registerUserHandler = factory.createHandlers(
  zValidator("json", userSchema, (result, c) => {
    if (!result.success) {
      const error = JSON.parse(result.error.message);
      return c.json(
        {
          success: false,
          messages: error.map((err: ZodIssue) => err.message),
        },
        400
      );
    }
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const user = await getUserDb(body.username);
      if (user) {
        return c.json(
          { success: false, messages: ["User already exists"] },
          400
        );
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const newUser: InsertUser = {
        username: body.username,
        password: hashedPassword,
      };
      const newUserResult = await insertUserDb(newUser);
      if (!newUserResult) {
        return c.json(
          {
            success: false,
            messages: ["Something went wrong creating the user"],
          },
          500
        );
      }
      const { password, ...safeUser } = newUserResult;
      return c.json(
        {
          success: true,
          messages: ["Successfully created an account"],
          user: { ...safeUser },
        },
        201
      );
    } catch (err) {
      return c.json(
        { success: false, messages: ["Failed to register user"] },
        500
      );
    }
  }
);
