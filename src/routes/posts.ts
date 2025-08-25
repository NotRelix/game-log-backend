import { Hono } from "hono";
import {
  createPostHandler,
  deletePostHandler,
  editPostHandler,
  getPostHandler,
  getPostsHandler,
} from "../controllers/posts.js";
import { jwtMiddleware } from "../middleware/auth.js";
import comments from "./comments.js";

const app = new Hono();

app.get("/", ...getPostsHandler);
app.post("/", jwtMiddleware, ...createPostHandler);

app.get("/:postId", ...getPostHandler);
app.patch("/:postId", jwtMiddleware, ...editPostHandler);
app.delete("/:postId", jwtMiddleware, ...deletePostHandler);

app.route("/:postId/comments", comments);

export default app;
