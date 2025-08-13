import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Models
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 24 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  roleId: integer().notNull().default(2),
});

export const rolesTable = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  role: varchar({ length: 24 }),
});

export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }),
  body: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
  authorId: integer().notNull(),
});

export const commentsTable = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  comment: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
  postId: integer().notNull(),
  authorId: integer().notNull(),
  parentId: integer().references(() => commentsTable.id, {
    onDelete: "cascade",
  }),
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  posts: many(postsTable),
  role: one(rolesTable, {
    fields: [usersTable.roleId],
    references: [rolesTable.id],
  }),
  comments: many(commentsTable),
}));

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.authorId],
    references: [usersTable.id],
  }),
  comments: many(commentsTable),
}));

export const rolesRelations = relations(rolesTable, ({ many }) => ({
  users: many(usersTable),
}));

export const commentsRelations = relations(commentsTable, ({ one, many }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id],
  }),
  author: one(usersTable, {
    fields: [commentsTable.authorId],
    references: [usersTable.id],
  }),
  parent: one(commentsTable, {
    fields: [commentsTable.parentId],
    references: [commentsTable.id],
    relationName: "commentsToReplies",
  }),
  replies: many(commentsTable, {
    relationName: "commentsToReplies",
  }),
}));
