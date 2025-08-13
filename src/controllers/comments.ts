import { createFactory } from "hono/factory";
import { createCommentDb } from "../db/query.ts";

const factory = createFactory();

export const createCommentHandler = factory.createHandlers(async (c) => {
  try {
    const { comment } = await c.req.json();
    const postId = Number(c.req.param("postId"));
    const user = c.get("jwtPayload");
    const createdComment = await createCommentDb(comment, postId, user.id);
    return c.json(createdComment, 201);
  } catch (err) {
    return c.json({ error: "Failed to create comment" }, 500);
  }
});
