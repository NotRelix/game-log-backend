import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3).max(16).toLowerCase(),
  password: z.string().min(8),
});

export const postSchema = z.object({
  title: z.string().max(255),
  body: z.string().max(5000),
});
