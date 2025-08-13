import { createFactory } from "hono/factory";
import type { InsertPost } from "../db/types.ts";
import {
  createPostDb,
  deletePostDb,
  editPostDb,
  getPostDb,
  getPostsDb,
} from "../db/query.ts";
import { zValidator } from "@hono/zod-validator";
import { postSchema } from "../validators/post.ts";

const factory = createFactory();

export const getPostsHandler = factory.createHandlers(async (c) => {
  try {
    const posts = await getPostsDb();
    return c.json(posts, 200);
  } catch (err) {
    return c.json({ error: "Failed to get posts" }, 500);
  }
});

export const createPostHandler = factory.createHandlers(
  zValidator("json", postSchema),
  async (c) => {
    try {
      const user = c.get("jwtPayload");
      const body = await c.req.valid("json");
      const newPost: InsertPost = {
        title: body.title,
        body: body.body,
        authorId: user.id,
        published: body.published,
      };
      const post = await createPostDb(newPost);
      return c.json(post, 201);
    } catch (err) {
      return c.json({ error: "Failed to create post" }, 500);
    }
  }
);

export const getPostHandler = factory.createHandlers(async (c) => {
  try {
    const postId = Number(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post id" }, 400);
    }
    const post = await getPostDb(postId);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json(post);
  } catch (err) {
    return c.json({ error: "Failed to get single post" }, 500);
  }
});

export const editPostHandler = factory.createHandlers(
  zValidator("json", postSchema.partial()),
  async (c) => {
    try {
      const postId = Number(c.req.param("postId"));
      if (isNaN(postId)) {
        return c.json({ error: "Invalid post id" }, 400);
      }
      const post = await getPostDb(postId);
      if (!post) {
        return c.json({ error: "Post doesn't exist" }, 404);
      }
      const user = c.get("jwtPayload");
      if (post.authorId !== user.id) {
        return c.json({ error: "Unauthorized access" }, 403);
      }
      const newPost = await c.req.valid("json");
      const updated = await editPostDb(postId, newPost);
      return c.json(updated, 200);
    } catch (err) {
      return c.json({ error: "Failed to edit post" }, 500);
    }
  }
);

export const deletePostHandler = factory.createHandlers(async (c) => {
  try {
    const postId = Number(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post id" }, 400);
    }
    const post = await getPostDb(postId);
    if (!post) {
      return c.json({ error: "Post doesn't exist" }, 404);
    }
    const user = c.get("jwtPayload");
    if (post.authorId !== user.id) {
      return c.json({ error: "Unauthorized access" }, 403);
    }
    const deleted = await deletePostDb(postId);
    return c.json(deleted, 200);
  } catch (err) {
    return c.json({ error: "Failed to delete post" }, 500);
  }
});
