import { and, eq } from "drizzle-orm";
import type { UserSchema } from "../types/user.ts";
import { db } from "./drizzle.ts";
import { usersTable } from "./schema.ts";

export const getUser = async (newUser: UserSchema) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.username, newUser.username),
        eq(usersTable.password, newUser.password)
      )
    );
  return user[0];
};

export const insertUser = async (newUser: UserSchema) => {
  const user = await db.insert(usersTable).values(newUser).returning();
  return user[0];
};
