import { eq } from "drizzle-orm";
import { db } from "./drizzle.ts";
import { postsTable, usersTable } from "./schema.ts";
import type {
  InsertPost,
  InsertUser,
  SelectPost,
  SelectUser,
} from "./types.ts";

export const getUser = async (username: string): Promise<SelectUser | null> => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  return user[0] ?? null;
};

export const insertUser = async (
  newUser: InsertUser
): Promise<SelectUser | null> => {
  const user = await db.insert(usersTable).values(newUser).returning();
  return user[0] ?? null;
};

export const insertPost = async (
  newPost: InsertPost
): Promise<SelectPost | null> => {
  const post = await db.insert(postsTable).values(newPost).returning();
  return post[0] ?? null;
};
