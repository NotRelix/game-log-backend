import z from "zod";

export const postSchema = z.object({
  title: z.string().max(255, "Title must be under 255 characters"),
  body: z.string().max(5000, "Body must be under 5000 characters"),
  published: z.boolean(),
});
