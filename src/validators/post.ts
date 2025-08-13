import z from "zod";

export const postSchema = z.object({
  title: z.string().max(255),
  body: z.string().max(5000),
  published: z.boolean(),
});
