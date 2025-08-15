import { createFactory } from "hono/factory";
import {
  createCommentDb,
  deleteCommentDb,
  editCommentDb,
  getCommentDb,
  getCommentsDb,
} from "../db/query.ts";
import { commentSchema } from "../validators/comment.ts";
import { validator } from "../middleware/validator.ts";

const factory = createFactory();

export const getCommentsHandler = factory.createHandlers(async (c) => {
  try {
    const postId = Number(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ success: false, messages: ["Invalid post id"] }, 400);
    }
    const comments = await getCommentsDb(postId);
    return c.json(
      {
        success: true,
        messages: ["Successfully fetched all comments"],
        comments: comments,
      },
      200
    );
  } catch (err) {
    return c.json(
      { success: false, messages: ["Failed to get comments"] },
      500
    );
  }
});

export const createCommentHandler = factory.createHandlers(
  validator(commentSchema),
  async (c) => {
    try {
      const body = await c.req.valid("json");
      const postId = Number(c.req.param("postId"));
      if (isNaN(postId)) {
        return c.json({ success: false, messages: ["Invalid post id"] }, 400);
      }
      const user = c.get("jwtPayload");
      const createdComment = await createCommentDb(
        body.comment,
        postId,
        user.id
      );
      return c.json(
        {
          success: true,
          messages: ["Successfully created a comment"],
          comment: createdComment,
        },
        201
      );
    } catch (err) {
      return c.json(
        { success: false, messages: ["Failed to create a comment"] },
        500
      );
    }
  }
);

export const editCommentHandler = factory.createHandlers(
  validator(commentSchema),
  async (c) => {
    try {
      const postId = Number(c.req.param("postId"));
      if (isNaN(postId)) {
        return c.json({ success: false, messages: ["Invalid post id"] }, 400);
      }
      const commentId = Number(c.req.param("commentId"));
      if (isNaN(commentId)) {
        return c.json(
          { success: false, messages: ["Invalid comment id"] },
          400
        );
      }
      const comment = await getCommentDb(commentId);
      if (!comment) {
        return c.json(
          { success: false, messages: ["Comment doesn't exist"] },
          404
        );
      }
      const user = c.get("jwtPayload");
      if (comment.authorId !== user.id) {
        return c.json(
          { success: false, messages: ["Unauthorized access"] },
          403
        );
      }
      const newComment = await c.req.valid("json");
      const editedComment = await editCommentDb(commentId, newComment);
      return c.json(
        {
          success: true,
          messages: ["Successfully edited a comment"],
          comment: editedComment,
        },
        200
      );
    } catch (err) {
      return c.json(
        { success: false, messages: ["Failed to edit comment"] },
        500
      );
    }
  }
);

export const deleteCommentHandler = factory.createHandlers(async (c) => {
  try {
    const commentId = Number(c.req.param("commentId"));
    if (isNaN(commentId)) {
      return c.json({ success: false, messages: ["Invalid comment id"] }, 400);
    }
    const comment = await getCommentDb(commentId);
    if (!comment) {
      return c.json(
        { success: false, messages: ["Comment doesn't exist"] },
        404
      );
    }
    const user = c.get("jwtPayload");
    if (comment.authorId !== user.id) {
      return c.json({ success: false, messages: ["Unauthorized access"] }, 403);
    }
    const deletedComment = await deleteCommentDb(commentId);
    return c.json(
      {
        success: true,
        messages: ["Successfully deleted a comment"],
        comment: deletedComment,
      },
      200
    );
  } catch (err) {
    return c.json(
      { success: false, messages: ["Failed to delete comment"] },
      500
    );
  }
});
