import { createFactory } from "hono/factory";
import { verify } from "hono/jwt";

const factory = createFactory();

export const authUserHandler = factory.createHandlers(async (c) => {
  try {
    const header = c.req.header("Authorization");
    if (!header) {
      return c.json({ success: false, messages: ["No header passed"] }, 401);
    }
    const token = header.split(" ")[1];
    const payload = await verify(token, process.env.JWT_SECRET!);
    return c.json({
      success: true,
      messages: ["Successfully validated user"],
      user: payload,
    });
  } catch (err) {
    return c.json(
      {
        success: false,
        messages: ["Failed to authenticate user"],
      },
      500
    );
  }
});
