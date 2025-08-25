import { Hono } from "hono";
import { registerUserHandler } from "../controllers/register.js";
const app = new Hono();
app.post("/", ...registerUserHandler);
export default app;
