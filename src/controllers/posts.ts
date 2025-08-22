import { createFactory } from "hono/factory";
import type { InsertPost } from "../db/types.ts";
import {
  createPostDb,
  deletePostDb,
  editPostDb,
  getEditorsPostsDb,
  getPostDb,
  getPostsDb,
} from "../db/query.ts";
import { postSchema } from "../validators/post.ts";
import { validator } from "../middleware/validator.ts";
import supabase from "../../config/supabase.ts";

const factory = createFactory();

export const getPostsHandler = factory.createHandlers(async (c) => {
  try {
    const posts = await getPostsDb();
    const editorsPosts = await getEditorsPostsDb();
    return c.json(
      {
        success: true,
        messages: ["Successfully fetched all posts"],
        posts: posts,
        editorsPosts: editorsPosts,
      },
      200
    );
  } catch (err) {
    return c.json({ success: false, messages: ["Failed to get posts"] }, 500);
  }
});

export const createPostHandler = factory.createHandlers(async (c) => {
  try {
    const user = c.get("jwtPayload");
    const body = await c.req.parseBody();
    const parsed = postSchema.safeParse({
      title: body.title,
      body: body.body,
      published: body.published === "true",
    });
    if (!parsed.success) {
      return c.json({ success: false, messages: parsed.error }, 400);
    }

    const file = body.headerImg as File;
    let filePath = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const safeOriginalName = file.name
        .normalize("NFKD")
        .replace(/[^\x00-\x7F]/g, "")
        .replace(/\s+/g, "_");

      filePath = `${Date.now()}-${safeOriginalName}`;
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
        });
      if (error) throw error;
    }

    const headerImgPath = filePath
      ? `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`
      : null;
    const newPost: InsertPost = {
      title: parsed.data.title,
      body: parsed.data.body,
      authorId: user.id,
      published: body.published === "true",
      headerImgPath: headerImgPath,
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
    return c.json({ success: false, messages: ["Failed to create post"] }, 500);
  }
});

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

export const editPostHandler = factory.createHandlers(async (c) => {
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
    const body = await c.req.parseBody();
    const parsed = postSchema.safeParse({
      title: body.title,
      body: body.body,
      published: body.published === "true",
    });
    if (!parsed.success) {
      return c.json({ success: false, messages: parsed.error }, 400);
    }

    const file = body.headerImg as File;
    let filePath = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const safeOriginalName = file.name
        .normalize("NFKD")
        .replace(/[^\x00-\x7F]/g, "")
        .replace(/\s+/g, "_");

      filePath = `${Date.now()}-${safeOriginalName}`;
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
        });
      if (error) throw error;
    }

    const headerImgPath = filePath
      ? `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`
      : null;
    const newPost: InsertPost = {
      title: parsed.data.title,
      body: parsed.data.body,
      authorId: user.id,
      published: body.published === "true",
      ...(filePath && { headerImgPath: headerImgPath }),
    };
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
});

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
