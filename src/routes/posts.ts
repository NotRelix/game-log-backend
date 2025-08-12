import { Hono } from "hono";
import { createPost, getPosts } from "../controllers/posts.ts";
import { jwtMiddleware } from "../middleware/auth.ts";

const app = new Hono();

app.get("/", ...getPosts);
app.post("/", jwtMiddleware, ...createPost);

export default app;
