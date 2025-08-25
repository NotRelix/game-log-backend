import { createFactory } from "hono/factory";
import { db } from "../db/drizzle.ts";
import { usersTable } from "../db/schema.ts";
import { getUserPostsDb } from "../db/query.ts";
const factory = createFactory();
export const getUsers = factory.createHandlers(async (c) => {
    const users = await db.select().from(usersTable);
    return c.json(users);
});
export const getUserPostsHandler = factory.createHandlers(async (c) => {
    try {
        const user = c.get("jwtPayload");
        const userId = user.id;
        const userIdParams = Number(c.req.param("userId"));
        if (userId !== userIdParams) {
            return c.json({ success: false, messages: ["Unauthorized Access"] }, 403);
        }
        const posts = await getUserPostsDb(userId);
        return c.json({
            success: true,
            messages: ["Successfully fetched user posts"],
            posts: posts,
        }, 200);
    }
    catch (err) {
        return c.json({ success: false, messages: ["Failed to get user posts"] }, 500);
    }
});
