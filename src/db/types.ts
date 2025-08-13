import type { commentsTable, postsTable, usersTable } from "./schema.ts";

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type SelectPost = typeof postsTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;

export type SelectComment = typeof commentsTable.$inferSelect;
export type InsertComment = typeof commentsTable.$inferInsert;
