import { Hono } from "hono";
import { authUserHandler } from "../controllers/auth.js";

const app = new Hono();

app.get("/validate", ...authUserHandler);

export default app;