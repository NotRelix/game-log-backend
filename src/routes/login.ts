import { Hono } from "hono";
import { loginUser } from "../controllers/login.ts";

const app = new Hono();

app.post("/", ...loginUser);

export default app;