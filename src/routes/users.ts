import { Hono } from "hono";
import { getUsers, insertUser } from "../controllers/users.ts";

const app = new Hono();

app.get("/", ...getUsers);
app.post("/", ...insertUser);

export default app;
