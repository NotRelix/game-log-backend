import { createFactory } from "hono/factory";

const factory = createFactory();

export const getUsers = factory.createHandlers((c) => {
  return c.json("Getting all users...");
});
