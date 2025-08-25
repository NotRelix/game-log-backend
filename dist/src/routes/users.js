import { Hono } from "hono";
import { getUserPostsHandler, getUsers } from "../controllers/users.js";
import { jwtMiddleware } from "../middleware/auth.js";
const app = new Hono();
app.get("/", ...getUsers);
app.get("/:userId/posts", jwtMiddleware, ...getUserPostsHandler);
export default app;
