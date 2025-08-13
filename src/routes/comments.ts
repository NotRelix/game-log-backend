import { Hono } from "hono";
import { jwtMiddleware } from "../middleware/auth.ts";
import {
  createCommentHandler,
  getCommentsHandler,
} from "../controllers/comments.ts";

const app = new Hono();

app.get("/", ...getCommentsHandler);
app.post("/", jwtMiddleware, ...createCommentHandler);

export default app;
