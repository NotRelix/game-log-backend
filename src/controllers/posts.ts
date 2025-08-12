import { createFactory } from "hono/factory";
import type { InsertPost } from "../db/types.ts";
import { getAllPosts, getPost, insertPost } from "../db/query.ts";
import { zValidator } from "@hono/zod-validator";
import { postSchema } from "../validators/user.ts";

const factory = createFactory();

export const getPosts = factory.createHandlers(async (c) => {
  try {
    const posts = await getAllPosts();
    return c.json(posts);
  } catch (err) {
    return c.json({ error: "Failed to get posts: ", err });
  }
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
      return c.json({ error: "Failed to create post: ", details: err });
    }
  }
);

export const getSinglePost = factory.createHandlers(async (c) => {
  try {
    const postIdStr = c.req.param("postId");
    const postId = Number(postIdStr);
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post id" });
    }
    const post = await getPost(postId);
    if (!post) {
      return c.json({ error: "Post not found" });
    }
    return c.json(post);
  } catch (err) {
    return c.json({ error: "Failed to get single post: ", details: err });
  }
});
