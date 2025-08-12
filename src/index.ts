import { serve } from "@hono/node-server";
import { Hono } from "hono";
import users from "./routes/users.ts";
import register from "./routes/register.ts";
import login from "./routes/login.ts";
import posts from "./routes/posts.ts";
import type { Variables } from "./types/env.ts";

const app = new Hono<{ Variables: Variables }>();

app.route("/register", register);
app.route("/login", login);

app.route("/users", users);
app.route("/posts", posts);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
