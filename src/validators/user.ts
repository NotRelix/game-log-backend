import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3).max(16).toLowerCase(),
  password: z.string().min(8),
});
