import { desc, eq, sql } from "drizzle-orm";
import { db } from "./drizzle.ts";
import {
  commentsTable,
  postsTable,
  repliesTable,
  usersTable,
} from "./schema.ts";
import type {
  InsertComment,
  InsertPost,
  InsertUser,
  SelectComment,
  SelectPost,
  SelectReplies,
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
    .select({
      authorId: postsTable.authorId,
      body: postsTable.body,
      createdAt: postsTable.createdAt,
      headerImgPath: postsTable.headerImgPath,
      id: postsTable.id,
      published: postsTable.published,
      title: postsTable.title,
      updatedAt: postsTable.updatedAt,
      author: usersTable.username,
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(usersTable.id, postsTable.authorId))
    .where(eq(postsTable.id, postId));
  return post[0] ?? null;
};

export const getPostsDb = async (): Promise<SelectPost[] | null> => {
  const posts = await db
    .select()
    .from(postsTable)
    .orderBy(desc(postsTable.createdAt));
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
): Promise<{ comments: SelectComment[]; totalCount: number } | null> => {
  const comments = await db.query.commentsTable.findMany({
    where: eq(commentsTable.postId, postId),
    with: {
      replies: true,
    },
    orderBy: (comments, { desc }) => [desc(commentsTable.createdAt)],
  });

  if (!comments) return null;

  const totalCount =
    comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0);
  return { comments, totalCount };
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
): Promise<SelectComment | null> => {
  const createdComment = await db
    .insert(commentsTable)
    .values({ comment, postId, authorId })
    .returning();
  return createdComment[0] ?? null;
};

export const editCommentDb = async (
  commentId: number,
  newComment: Partial<InsertComment>
): Promise<SelectComment | null> => {
  const editedComment = await db
    .update(commentsTable)
    .set({ updatedAt: sql`NOW()`, ...newComment })
    .where(eq(commentsTable.id, commentId))
    .returning();
  return editedComment[0] ?? null;
};

export const deleteCommentDb = async (
  commentId: number
): Promise<SelectComment | null> => {
  const deletedComment = await db
    .delete(commentsTable)
    .where(eq(commentsTable.id, commentId))
    .returning();
  return deletedComment[0] ?? null;
};

export const createReplyDb = async (
  comment: string,
  postId: number,
  authorId: number,
  parentId: number
): Promise<SelectReplies | null> => {
  const newReply = await db
    .insert(repliesTable)
    .values({
      comment,
      postId,
      authorId,
      parentId,
    })
    .returning();
  return newReply[0] ?? null;
};

export const getUserPostsDb = async (
  userId: number
): Promise<SelectPost[] | null> => {
  const userPosts = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.authorId, userId));
  return userPosts ?? null;
};

export const getEditorsPostsDb = async (): Promise<SelectPost[] | null> => {
  const editorsPosts = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      body: postsTable.body,
      headerImgPath: postsTable.headerImgPath,
      published: postsTable.published,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      authorId: postsTable.authorId,
      author: usersTable.username,
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(usersTable.id, postsTable.authorId))
    .where(eq(usersTable.roleId, 1))
    .orderBy(desc(postsTable.createdAt))
    .limit(5);
  return editorsPosts ?? null;
};
