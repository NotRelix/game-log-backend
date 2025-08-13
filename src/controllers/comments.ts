import { createFactory } from "hono/factory";

const factory = createFactory();

export const getCommentsHandler = factory.createHandlers(async (c) => {
  return c.json({ message: "getting all comments" });
});
