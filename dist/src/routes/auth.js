import { Hono } from "hono";
import { authUserHandler } from "../controllers/auth.ts";
const app = new Hono();
app.get("/validate", ...authUserHandler);
export default app;
