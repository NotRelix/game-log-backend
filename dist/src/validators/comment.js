import z from "zod";
export const commentSchema = z.object({
    comment: z
        .string()
        .trim()
        .min(1, "Comment must not be empty")
        .max(1000, "Comment must be under 1000 characters"),
});
