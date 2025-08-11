import { Hono } from "hono";
import { getUsers } from "../controllers/users.ts";

const app = new Hono();

app.get("/", ...getUsers);

export default app;
