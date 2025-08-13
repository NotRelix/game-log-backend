import { Hono } from "hono";
import {
  createPostHandler,
  deletePostHandler,
  editPostHandler,
  getPostHandler,
  getPostsHandler,
} from "../controllers/posts.ts";
import { jwtMiddleware } from "../middleware/auth.ts";
import { createCommentHandler } from "../controllers/comments.ts";

const app = new Hono();

app.get("/", ...getPostsHandler);
app.post("/", jwtMiddleware, ...createPostHandler);

app.get("/:postId", ...getPostHandler);
app.post("/:postId", jwtMiddleware, ...createCommentHandler);
app.patch("/:postId", jwtMiddleware, ...editPostHandler);
app.delete("/:postId", jwtMiddleware, ...deletePostHandler);

export default app;
