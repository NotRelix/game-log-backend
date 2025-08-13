import { Hono } from "hono";
import { createReplyHandler } from "../controllers/replies.ts";
import { jwtMiddleware } from "../middleware/auth.ts";

const app = new Hono();

app.post("/replies", jwtMiddleware, ...createReplyHandler);

export default app;
