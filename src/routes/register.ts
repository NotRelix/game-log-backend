import { Hono } from "hono";
import { registerUser } from "../controllers/register.ts";

const app = new Hono();

app.post("/", ...registerUser);

export default app;
