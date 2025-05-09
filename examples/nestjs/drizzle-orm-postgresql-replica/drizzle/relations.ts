import { relations } from "drizzle-orm/relations";
import { user, wallet, walletSharing } from "./schema";

export const walletRelations = relations(wallet, ({one, many}) => ({
	user: one(user, {
		fields: [wallet.ownerId],
		references: [user.id]
	}),
	walletSharings: many(walletSharing),
}));

export const userRelations = relations(user, ({many}) => ({
	wallets: many(wallet),
	walletSharings: many(walletSharing),
}));

export const walletSharingRelations = relations(walletSharing, ({one}) => ({
	wallet: one(wallet, {
		fields: [walletSharing.walletId],
		references: [wallet.id]
	}),
	user: one(user, {
		fields: [walletSharing.userId],
		references: [user.id]
	}),
}));