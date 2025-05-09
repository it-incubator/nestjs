import { pgTable, integer, varchar, uuid, serial, boolean, foreignKey, char, timestamp, date, smallint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const profile = pgTable("profile", {
	userId: integer().primaryKey().notNull(),
	hobby: varchar(),
	education: varchar(),
});

export const walletSharingLimit = pgTable("wallet_sharing_limit", {
	walletSharingId: uuid().primaryKey().notNull(),
	limitPerDay: integer(),
	limitPerWeek: integer(),
	limitPerMonth: integer(),
});

export const user = pgTable("user", {
	id: serial().primaryKey().notNull(),
	firstName: varchar(),
	lastName: varchar(),
	passportNumber: varchar(),
	isMarried: boolean(),
});

export const wallet = pgTable("wallet", {
	id: uuid().primaryKey().notNull(),
	title: varchar(),
	currency: char({ length: 3 }),
	balance: integer().notNull(),
	addedAt: timestamp({ mode: 'string' }).notNull(),
	ownerId: integer(),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "FK_9bf56f7989a7e5717c92221cce0"
		}),
]);

export const walletSharing = pgTable("wallet_sharing", {
	id: uuid().primaryKey().notNull(),
	addedDate: date().defaultNow().notNull(),
	status: smallint(),
	walletId: uuid(),
	userId: integer(),
}, (table) => [
	foreignKey({
			columns: [table.walletId],
			foreignColumns: [wallet.id],
			name: "FK_81fc589dc99b1a78e095a81871b"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "FK_df5c10e16fc947b0e693f8335d5"
		}),
]);
