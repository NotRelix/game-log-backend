CREATE TABLE "roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role" varchar(24)
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roleId" integer DEFAULT 1 NOT NULL;