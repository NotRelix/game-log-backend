import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(16, "Username must be under 16 characters")
    .toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
