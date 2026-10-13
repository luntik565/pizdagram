ALTER TABLE "messages" ALTER COLUMN "massage" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "mediaURL" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" varchar(255) DEFAULT '';