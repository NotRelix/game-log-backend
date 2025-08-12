import { createFactory } from "hono/factory";
import type { InsertPost } from "../db/types.ts";
import { insertPost } from "../db/query.ts";

const factory = createFactory();

export const getPosts = factory.createHandlers(async (c) => {
  return c.json("getting posts");
});

export const createPost = factory.createHandlers(async (c) => {
  // TODO: add validations
  // Mock test
  const body = await c.req.json();
  const newPost: InsertPost = {
    title: body.title,
    body: body.body,
    userId: 1,
  };
  const post = await insertPost(newPost);
  return c.json(post);
});
