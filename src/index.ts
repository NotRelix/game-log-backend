import { serve } from "@hono/node-server";
import { Hono } from "hono";
import users from "./routes/users.ts";

const app = new Hono();

app.route("/users", users);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
