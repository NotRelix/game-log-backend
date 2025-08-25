import { zValidator } from "@hono/zod-validator";
import * as z4 from "zod/v4/core";
export const validator = (schema) => {
    return zValidator("json", schema, (result, c) => {
        if (!result.success) {
            const error = JSON.parse(result.error.message);
            return c.json({
                success: false,
                messages: error.map((err) => err.message),
            }, 400);
        }
    });
};
