ALTER TABLE "comments" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now();