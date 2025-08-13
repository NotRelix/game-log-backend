import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { commentSchema } from "../validators/comment.ts";
import { createReplyDb, getCommentDb } from "../db/query.ts";

const factory = createFactory();

export const createReplyHandler = factory.createHandlers(
  zValidator("json", commentSchema),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const postId = Number(c.req.param("postId"));
      if (isNaN(postId)) {
        return c.json({ error: "Invalid post id" }, 400);
      }
      const parentId = Number(c.req.param("commentId"));
      if (isNaN(parentId)) {
        return c.json({ error: "Invalid parent id" }, 400);
      }
      const parentComment = await getCommentDb(parentId);
      if (!parentComment) {
        return c.json({ error: "Parent comment doesn't exist" }, 404);
      }
      const user = c.get("jwtPayload");
      console.log(user);
      const newReply = await createReplyDb(
        body.comment,
        postId,
        user.id,
        parentId
      );
      return c.json(newReply, 201);
    } catch (err) {
      return c.json({ error: "Failed to reply to comment" }, 500);
    }
  }
);
