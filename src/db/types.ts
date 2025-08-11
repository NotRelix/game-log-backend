import type { postsTable, usersTable } from "./schema.ts";

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type SelectPost = typeof postsTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
