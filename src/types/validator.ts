import type { commentSchema } from "../validators/comment.js";
import type { postSchema } from "../validators/post.js";
import type { userSchema } from "../validators/user.js";

export type userSchemaType = typeof userSchema;
export type postSchemaType = typeof postSchema;
export type commentSchemaType = typeof commentSchema;
