import { createFactory } from "hono/factory";
import {
  createCommentDb,
  editCommentDb,
  getCommentDb,
  getCommentsDb,
} from "../db/query.ts";
import { zValidator } from "@hono/zod-validator";
import { commentSchema } from "../validators/comment.ts";

const factory = createFactory();

export const getCommentsHandler = factory.createHandlers(async (c) => {
  try {
    const postId = Number(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post id" }, 400);
    }
    const comments = await getCommentsDb(postId);
    return c.json(comments, 200);
  } catch (err) {
    return c.json({ error: "Failed to get comments" }, 500);
  }
});

export const createCommentHandler = factory.createHandlers(
  zValidator("json", commentSchema),
  async (c) => {
    try {
      const body = await c.req.valid("json");
      const postId = Number(c.req.param("postId"));
      if (isNaN(postId)) {
        return c.json({ error: "Invalid post id" }, 400);
      }
      const user = c.get("jwtPayload");
      if (!user) {
        return c.json({ error: "Login to comment" }, 403);
      }
      const createdComment = await createCommentDb(
        body.comment,
        postId,
        user.id
      );
      return c.json(createdComment, 201);
    } catch (err) {
      return c.json({ error: "Failed to create a comment" }, 500);
    }
  }
);

export const editCommentHandler = factory.createHandlers(async (c) => {
  const postId = Number(c.req.param("postId"));
  if (isNaN(postId)) {
    return c.json({ error: "Invalid post id" }, 400);
  }
  const commentId = Number(c.req.param("commentId"));
  if (isNaN(commentId)) {
    return c.json({ error: "Invalid comment id" }, 400);
  }
  const comment = await getCommentDb(commentId);
  if (!comment) {
    return c.json({ error: "Comment doesn't exist" }, 404);
  }
  const user = c.get("jwtPayload");
  if (comment.authorId !== user.id) {
    return c.json({ error: "Unauthorized access" }, 403);
  }
  const newComment = await c.req.json();
  const cleanComment = Object.fromEntries(
    Object.entries(newComment).filter(([_, v]) => v !== undefined)
  );
  const editedComment = await editCommentDb(commentId, cleanComment);
  return c.json({ comment: editedComment });
});
