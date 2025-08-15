import { createFactory } from "hono/factory";
import type { InsertPost } from "../db/types.ts";
import {
  createPostDb,
  deletePostDb,
  editPostDb,
  getPostDb,
  getPostsDb,
} from "../db/query.ts";
import { postSchema } from "../validators/post.ts";
import { validator } from "../middleware/validator.ts";

const factory = createFactory();

export const getPostsHandler = factory.createHandlers(async (c) => {
  try {
    const posts = await getPostsDb();
    return c.json(
      {
        success: true,
        messages: ["Successfully fetched all posts"],
        posts: posts,
      },
      200
    );
  } catch (err) {
    return c.json({ success: false, messages: ["Failed to get posts"] }, 500);
  }
});

export const createPostHandler = factory.createHandlers(
  validator(postSchema),
  async (c) => {
    try {
      const user = c.get("jwtPayload");
      const body = await c.req.valid("json");
      const newPost: InsertPost = {
        title: body.title,
        body: body.body,
        authorId: user.id,
        published: body.published,
      };
      const post = await createPostDb(newPost);
      return c.json(
        {
          success: true,
          messages: ["Successfully created a post"],
          post: post,
        },
        201
      );
    } catch (err) {
      return c.json(
        { success: false, messages: ["Failed to create post"] },
        500
      );
    }
  }
);

export const getPostHandler = factory.createHandlers(async (c) => {
  try {
    const postId = Number(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ success: false, messages: ["Invalid post id"] }, 400);
    }
    const post = await getPostDb(postId);
    if (!post) {
      return c.json({ success: false, messages: ["Post not found"] }, 404);
    }
    return c.json({
      success: true,
      messages: ["Successfully fetched a post"],
      post: post,
    });
  } catch (err) {
    return c.json(
      { success: false, messages: ["Failed to get single post"] },
      500
    );
  }
});

export const editPostHandler = factory.createHandlers(
  validator(postSchema.partial()),
  async (c) => {
    try {
      const postId = Number(c.req.param("postId"));
      if (isNaN(postId)) {
        return c.json({ success: false, messages: ["Invalid post id"] }, 400);
      }
      const post = await getPostDb(postId);
      if (!post) {
        return c.json(
          { success: false, messages: ["Post doesn't exist"] },
          404
        );
      }
      const user = c.get("jwtPayload");
      if (post.authorId !== user.id) {
        return c.json(
          { success: false, messages: ["Unauthorized access"] },
          403
        );
      }
      const newPost = await c.req.valid("json");
      const updated = await editPostDb(postId, newPost);
      return c.json(
        {
          success: true,
          messages: ["Successfully edited post"],
          post: updated,
        },
        200
      );
    } catch (err) {
      return c.json({ success: false, messages: ["Failed to edit post"] }, 500);
    }
  }
);

export const deletePostHandler = factory.createHandlers(async (c) => {
  try {
    const postId = Number(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ success: false, messages: ["Invalid post id"] }, 400);
    }
    const post = await getPostDb(postId);
    if (!post) {
      return c.json({ success: false, messages: ["Post doesn't exist"] }, 404);
    }
    const user = c.get("jwtPayload");
    if (post.authorId !== user.id) {
      return c.json({ success: false, messages: ["Unauthorized access"] }, 403);
    }
    const deleted = await deletePostDb(postId);
    return c.json(
      { success: true, messages: ["Successfully deleted post"], post: deleted },
      200
    );
  } catch (err) {
    return c.json({ success: false, messages: ["Failed to delete post"] }, 500);
  }
});
