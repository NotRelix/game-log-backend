import { createFactory } from "hono/factory";

const factory = createFactory();

export const getPosts = factory.createHandlers(
  async (c) => {
    return c.json("getting posts");
});

export const createPost = factory.createHandlers(
  async (c) => {
    return c.json("creating post");
  }
)