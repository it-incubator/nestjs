import {ViewColumn, ViewEntity} from "typeorm";

@ViewEntity({
    expression: `
        SELECT 
            w.id AS id,
            w.currency AS currency,
            w."addedAt" AS "addedAt",
            CAST(ROW_NUMBER() OVER (PARTITION BY w."ownerId" ORDER BY w."addedAt") AS INT) AS "walletNumber"
        FROM wallet w
    `,
})
export class WalletView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    currency: string;

    @ViewColumn()
    addedAt: Date;

    @ViewColumn()
    walletNumber: number;
}