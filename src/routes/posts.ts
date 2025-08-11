import { Hono } from "hono";
import { createPost, getPosts } from "../controllers/posts.ts";

const app = new Hono();

app.get("/", ...getPosts);
app.post("/", ...createPost);

export default app;
