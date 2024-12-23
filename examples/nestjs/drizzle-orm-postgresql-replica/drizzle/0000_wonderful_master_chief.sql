CREATE TABLE "profile" (
	"userId" integer PRIMARY KEY NOT NULL,
	"hobby" varchar,
	"education" varchar
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar,
	"lastName" varchar,
	"passportNumber" varchar,
	"isMarried" boolean
);
--> statement-breakpoint
CREATE TABLE "wallet" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar,
	"currency" char(3),
	"balance" integer NOT NULL,
	"addedAt" timestamp NOT NULL,
	"ownerId" integer
);
--> statement-breakpoint
CREATE TABLE "wallet_sharing" (
	"id" uuid PRIMARY KEY NOT NULL,
	"addedDate" date DEFAULT now() NOT NULL,
	"status" smallint,
	"walletId" uuid,
	"userId" integer
);
--> statement-breakpoint
CREATE TABLE "wallet_sharing_limit" (
	"walletSharingId" uuid PRIMARY KEY NOT NULL,
	"limitPerDay" integer,
	"limitPerWeek" integer,
	"limitPerMonth" integer
);
--> statement-breakpoint
ALTER TABLE "wallet" ADD CONSTRAINT "FK_9bf56f7989a7e5717c92221cce0" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_sharing" ADD CONSTRAINT "FK_81fc589dc99b1a78e095a81871b" FOREIGN KEY ("walletId") REFERENCES "public"."wallet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_sharing" ADD CONSTRAINT "FK_df5c10e16fc947b0e693f8335d5" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;