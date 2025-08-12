import { Hono } from "hono";
import {
  createPost,
  deletePostHandler,
  editPost,
  getPosts,
  getSinglePost,
} from "../controllers/posts.ts";
import { jwtMiddleware } from "../middleware/auth.ts";

const app = new Hono();

app.get("/", ...getPosts);
app.post("/", jwtMiddleware, ...createPost);

app.get("/:postId", ...getSinglePost);
app.patch("/:postId", jwtMiddleware, ...editPost);
app.delete("/:postId", jwtMiddleware, ...deletePostHandler);

export default app;
