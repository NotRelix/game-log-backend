import { and, eq } from "drizzle-orm";
import type { UserSchema } from "../validators/user.ts";
import { db } from "./drizzle.ts";
import { usersTable } from "./schema.ts";
import type { User } from "./types.ts";

export const getUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  const user = await db
    .select()
    .from(usersTable)
    .where(
      and(eq(usersTable.username, username), eq(usersTable.password, password))
    );
  return user[0];
};

export const insertUser = async (newUser: UserSchema): Promise<User | null> => {
  const user = await db.insert(usersTable).values(newUser).returning();
  return user[0];
};
