import { Hono } from "hono";
import { getCommentsHandler } from "../controllers/comments.ts";

const app = new Hono();

app.get("/", ...getCommentsHandler);

export default app;
