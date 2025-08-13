import { Hono } from "hono";
import { jwtMiddleware } from "../middleware/auth.ts";
import { createCommentHandler } from "../controllers/comments.ts";

const app = new Hono();

app.post("/", jwtMiddleware, ...createCommentHandler);

export default app;