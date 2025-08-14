import type { commentSchema } from "../validators/comment.ts";
import type { postSchema } from "../validators/post.ts";
import type { userSchema } from "../validators/user.ts";

export type userSchemaType = typeof userSchema;
export type postSchemaType = typeof postSchema;
export type commentSchemaType = typeof commentSchema;
