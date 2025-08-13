import { Hono } from "hono";
import { createReplyHandler } from "../controllers/replies.ts";
import { jwtMiddleware } from "../middleware/auth.ts";
import {
  deleteCommentHandler,
  editCommentHandler,
} from "../controllers/comments.ts";

const app = new Hono();

app.post("/replies", jwtMiddleware, ...createReplyHandler);
app.patch("/replies", jwtMiddleware, ...editCommentHandler);
app.delete("/replies", jwtMiddleware, ...deleteCommentHandler);

export default app;
