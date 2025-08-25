import { Hono } from "hono";
import { getUserPostsHandler, getUsers } from "../controllers/users.ts";
import { jwtMiddleware } from "../middleware/auth.ts";
const app = new Hono();
app.get("/", ...getUsers);
app.get("/:userId/posts", jwtMiddleware, ...getUserPostsHandler);
export default app;
