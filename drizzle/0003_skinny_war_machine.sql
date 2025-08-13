CREATE TABLE "comments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"comment" text,
	"postId" integer NOT NULL,
	"authorId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "userId" TO "authorId";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roleId" SET DEFAULT 2;