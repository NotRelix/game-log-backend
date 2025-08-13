import { Hono } from "hono";
import { jwtMiddleware } from "../middleware/auth.ts";
import {
  createCommentHandler,
  deleteCommentHandler,
  editCommentHandler,
  getCommentsHandler,
} from "../controllers/comments.ts";

const app = new Hono();

app.get("/", ...getCommentsHandler);
app.post("/", jwtMiddleware, ...createCommentHandler);
app.patch("/:commentId", jwtMiddleware, ...editCommentHandler);
app.delete("/:commentId", jwtMiddleware, ...deleteCommentHandler);

export default app;
