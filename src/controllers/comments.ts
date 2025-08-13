import { createFactory } from "hono/factory";
import { createCommentDb } from "../db/query.ts";
import { zValidator } from "@hono/zod-validator";
import { commentSchema } from "../validators/comment.ts";

const factory = createFactory();

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
      return c.json({ error: "Failed to create comment" }, 500);
    }
  }
);
