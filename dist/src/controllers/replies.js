import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { commentSchema } from "../validators/comment.js";
import { createReplyDb, getCommentDb, getRepliesDb } from "../db/query.js";
const factory = createFactory();
export const getRepliesHandler = factory.createHandlers(async (c) => {
    try {
        const postId = Number(c.req.param("postId"));
        if (isNaN(postId)) {
            return c.json({ success: false, messages: ["Invalid post id"] }, 400);
        }
        const parentId = Number(c.req.param("commentId"));
        if (isNaN(parentId)) {
            return c.json({ success: false, messages: ["Invalid parent id"] }, 400);
        }
        const replies = await getRepliesDb(parentId);
        return c.json({
            success: true,
            messages: ["Successfully fetched replies"],
            replies: replies,
        }, 200);
    }
    catch (err) {
        return c.json({ success: false, messages: ["Failed to get replies"] }, 500);
    }
});
export const createReplyHandler = factory.createHandlers(zValidator("json", commentSchema), async (c) => {
    try {
        const body = c.req.valid("json");
        const postId = Number(c.req.param("postId"));
        if (isNaN(postId)) {
            return c.json({ error: "Invalid post id" }, 400);
        }
        const parentId = Number(c.req.param("commentId"));
        if (isNaN(parentId)) {
            return c.json({ error: "Invalid parent id" }, 400);
        }
        const parentComment = await getCommentDb(parentId);
        if (!parentComment) {
            return c.json({ error: "Parent comment doesn't exist" }, 404);
        }
        const user = c.get("jwtPayload");
        const newReply = await createReplyDb(body.comment, postId, user.id, parentId);
        return c.json({
            success: true,
            messages: ["Successfully posted a reply"],
            reply: newReply,
        }, 201);
    }
    catch (err) {
        return c.json({ error: "Failed to reply to comment" }, 500);
    }
});
