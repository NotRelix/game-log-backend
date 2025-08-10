import type { usersTable } from "../db/schema.ts";

export type User = typeof usersTable.$inferInsert;
