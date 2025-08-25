CREATE TABLE "replies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "replies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"comment" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"postId" integer NOT NULL,
	"authorId" integer NOT NULL,
	"parentId" integer
);
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentId_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_parentId_comments_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "parentId";