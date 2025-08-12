import { createFactory } from "hono/factory";
import type { InsertPost } from "../db/types.ts";
import { getAllPosts, insertPost } from "../db/query.ts";
import { zValidator } from "@hono/zod-validator";
import { postSchema } from "../validators/user.ts";

const factory = createFactory();

export const getPosts = factory.createHandlers(async (c) => {
  const posts = await getAllPosts();
  return c.json(posts);
});

export const createPost = factory.createHandlers(
  zValidator("json", postSchema),
  async (c) => {
    try {
      const user = c.get("jwtPayload");
      const body = await c.req.valid("json");
      const newPost: InsertPost = {
        title: body.title,
        body: body.body,
        userId: user.id,
      };
      const post = await insertPost(newPost);
      return c.json(post);
    } catch (err) {
      return c.json({ error: "Failed to create post: ", err });
    }
  }
);
