ALTER TABLE "messages" ALTER COLUMN "room_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "room_members" ALTER COLUMN "room_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "id" SET DATA TYPE varchar(100);