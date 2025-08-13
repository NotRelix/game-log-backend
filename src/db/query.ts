import { eq, sql } from "drizzle-orm";
import { db } from "./drizzle.ts";
import { commentsTable, postsTable, usersTable } from "./schema.ts";
import type {
  InsertComment,
  InsertPost,
  InsertUser,
  SelectComment,
  SelectPost,
  SelectUser,
} from "./types.ts";

export const getUserDb = async (
  username: string
): Promise<SelectUser | null> => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  return user[0] ?? null;
};

export const insertUserDb = async (
  newUser: InsertUser
): Promise<SelectUser | null> => {
  const user = await db.insert(usersTable).values(newUser).returning();
  return user[0] ?? null;
};

export const getPostDb = async (postId: number): Promise<SelectPost | null> => {
  if (!postId) return null;
  const post = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, postId));
  return post[0] ?? null;
};

export const getPostsDb = async (): Promise<SelectPost[] | null> => {
  const posts = await db.select().from(postsTable);
  return posts ?? null;
};

export const createPostDb = async (
  newPost: InsertPost
): Promise<SelectPost | null> => {
  const post = await db.insert(postsTable).values(newPost).returning();
  return post[0] ?? null;
};

export const editPostDb = async (
  postId: number,
  updated: Partial<InsertPost>
): Promise<SelectPost | null> => {
  const updatedPost = await db
    .update(postsTable)
    .set({ updatedAt: sql`NOW()`, ...updated })
    .where(eq(postsTable.id, postId))
    .returning();
  return updatedPost[0] ?? null;
};

export const deletePostDb = async (
  postId: number
): Promise<SelectPost | null> => {
  const deletedPost = await db
    .delete(postsTable)
    .where(eq(postsTable.id, postId))
    .returning();
  return deletedPost[0] ?? null;
};

export const getCommentsDb = async (
  postId: number
): Promise<SelectComment[] | null> => {
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postId, postId));
  return comments ?? null;
};

export const getCommentDb = async (
  commentId: number
): Promise<SelectComment | null> => {
  const comment = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.id, commentId));
  return comment[0] ?? null;
};

export const createCommentDb = async (
  comment: string,
  postId: number,
  authorId: number
): Promise<InsertComment | null> => {
  const createdComment = await db
    .insert(commentsTable)
    .values({
      comment,
      postId,
      authorId,
    })
    .returning();
  return createdComment[0] ?? null;
};

export const editCommentDb = async (
  commentId: number,
  newComment: Partial<InsertComment>
): Promise<SelectComment | null> => {
  const editedComment = await db
    .update(commentsTable)
    .set(newComment)
    .where(eq(commentsTable.id, commentId))
    .returning();
  return editedComment[0] ?? null;
};
