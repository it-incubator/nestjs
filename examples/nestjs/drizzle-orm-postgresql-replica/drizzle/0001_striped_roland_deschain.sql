ALTER TABLE "wallet" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "wallet_sharing" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "wallet_sharing" ALTER COLUMN "addedDate" SET DEFAULT now();