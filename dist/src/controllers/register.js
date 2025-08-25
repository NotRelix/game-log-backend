import { createFactory } from "hono/factory";
import { userSchema } from "../validators/user.js";
import { getUserDb, insertUserDb } from "../db/query.js";
import bcrypt from "bcrypt";
import { validator } from "../middleware/validator.js";
const factory = createFactory();
export const registerUserHandler = factory.createHandlers(validator(userSchema), async (c) => {
    try {
        const body = c.req.valid("json");
        const user = await getUserDb(body.username);
        if (user) {
            return c.json({ success: false, messages: ["User already exists"] }, 400);
        }
        const { confirmPassword } = await c.req.json();
        if (body.password !== confirmPassword) {
            return c.json({ success: false, messages: ["Passwords don't match"] }, 400);
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = {
            username: body.username,
            password: hashedPassword,
        };
        const newUserResult = await insertUserDb(newUser);
        if (!newUserResult) {
            return c.json({
                success: false,
                messages: ["Something went wrong creating the user"],
            }, 500);
        }
        const { password, ...safeUser } = newUserResult;
        return c.json({
            success: true,
            messages: ["Successfully created an account"],
            user: safeUser,
        }, 201);
    }
    catch (err) {
        return c.json({ success: false, messages: ["Failed to register user"] }, 500);
    }
});
