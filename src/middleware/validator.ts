import { zValidator } from "@hono/zod-validator";
import * as z4 from "zod/v4/core"
import type { ZodIssue } from "zod/v3";

export const validator = <T>(schema: z4.$ZodType<T>) => {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      const error: ZodIssue[] = JSON.parse(result.error.message);
      return c.json(
        {
          success: false,
          messages: error.map((err: ZodIssue) => err.message),
        },
        400
      );
    }
  });
};
