import { Hono } from "hono";
import { loginUserHandler } from "../controllers/login.ts";
const app = new Hono();
app.post("/", ...loginUserHandler);
export default app;
