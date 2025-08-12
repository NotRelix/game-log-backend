import { createFactory } from "hono/factory";
import type { InsertPost } from "../db/types.ts";
import {
  deletePostDb,
  getAllPosts,
  getPost,
  insertPost,
  updatePost,
} from "../db/query.ts";
import { zValidator } from "@hono/zod-validator";
import { postSchema } from "../validators/user.ts";

const factory = createFactory();

export const getPosts = factory.createHandlers(async (c) => {
  try {
    const posts = await getAllPosts();
    return c.json(posts, 200);
  } catch (err) {
    return c.json({ error: "Failed to get posts" }, 500);
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
      return c.json(post, 201);
    } catch (err) {
      return c.json({ error: "Failed to create post" }, 500);
    }
  }
);

export const getSinglePost = factory.createHandlers(async (c) => {
  try {
    const postIdStr = c.req.param("postId");
    const postId = Number(postIdStr);
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post id" }, 400);
    }
    const post = await getPost(postId);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json(post);
  } catch (err) {
    return c.json({ error: "Failed to get single post" }, 500);
  }
});

export const editPost = factory.createHandlers(
  zValidator("json", postSchema.partial()),
  async (c) => {
    try {
      const postId = Number(c.req.param("postId"));
      if (isNaN(postId)) {
        return c.json({ error: "Invalid post id" }, 400);
      }
      const post = await getPost(postId);
      if (!post) {
        return c.json({ error: "Post doesn't exist" }, 404);
      }
      const user = c.get("jwtPayload");
      if (post.userId !== user.id) {
        return c.json({ error: "Unauthorized access" }, 403);
      }
      const body = c.req.valid("json");
      const cleanPost = Object.fromEntries(
        Object.entries(body).filter(([_, v]) => v !== undefined)
      );
      const updated = await updatePost(postId, cleanPost);
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
    const post = await getPost(postId);
    if (!post) {
      return c.json({ error: "Post doesn't exist" }, 404);
    }
    const user = c.get("jwtPayload");
    if (post.userId !== user.id) {
      return c.json({ error: "Unauthorized access" }, 403);
    }
    const deleted = await deletePostDb(postId);
    return c.json(deleted, 200);
  } catch (err) {
    return c.json({ error: "Failed to delete post" }, 500);
  }
});
