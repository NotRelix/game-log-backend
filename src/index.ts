import { serve } from "@hono/node-server";
import { Hono } from "hono";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import posts from "./routes/posts.js";
import type { Variables } from "./types/env.js";
import { cors } from "hono/cors";

const app = new Hono<{ Variables: Variables }>();

app.use(cors());

app.route("/auth", auth);
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
