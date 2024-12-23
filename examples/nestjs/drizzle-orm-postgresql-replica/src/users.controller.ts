import {Controller, Get, Post, Query} from '@nestjs/common';
import {ApiPagination} from "./custom-decorators";
import {DbService} from "./db/db.service";
import {profile, user, wallet, walletSharing, walletSharingLimit} from "../drizzle/schema";
import {randomUUID} from 'crypto';
import {asc, count} from "drizzle-orm";

@Controller('users')
export class UsersController {
    maxLimit = 5;

    constructor(
        private readonly dataSource: DbService
    ) {
    }

    @Post('seed')
    async seed() {
        await this.dataSource.primaryDb.transaction(async tx => {
            await tx.delete(walletSharingLimit)
            await tx.delete(walletSharing)
            await tx.delete(wallet)
            await tx.delete(profile)
            await tx.delete(user)

            // Seed data
            for (let i = 1; i <= this.maxLimit; i++) {

                const [userResult] = await tx.insert(user)
                    .values({
                        firstName: `User${i}`,
                        lastName: `LastName${i}`,
                        passportNumber: `Passport${i}`,
                        isMarried: i % 2 === 0,
                    })
                    .returning()
                    .execute()

                const newProfile = {
                    userId: userResult.id,
                    hobby: `Hobby${i}`,
                    education: `Education${i}`,
                };

                await tx.insert(profile)
                    .values(newProfile)
                    .returning()
                    .execute()


                const oneDay = 86_400_000; // 24 * 60 * 60 * 1000 milliseconds


                for (let j = 1; j <= this.maxLimit - i; j++) {
                    const newWallet = {
                        id: randomUUID(),
                        title: `Wallet${j} of User${i}`,
                        currency: Math.random() > 0.5 ? 'USD' : 'EUR',
                        ownerId: userResult.id,
                        balance: j,
                        addedAt: new Date(Date.now() + j * oneDay).toISOString()
                    }

                    const [walletRes] = await tx.insert(wallet).values(newWallet).returning();

                    for (let k = 1; k <= 5; k++) {
                        const newWalletSharing = {
                            id: randomUUID(),
                            walletId: walletRes.id,
                            userId: userResult.id,
                            addedDate: new Date(),
                            status: k % 2 === 0 ? 1 : 0,
                        }

                        const [walletSharingRes] = await tx.insert(walletSharing).values(newWalletSharing).returning();

                        const newWalletSharingLimit = {
                            walletSharingId: walletSharingRes.id,
                            limitPerDay: 100 * k,
                            limitPerWeek: 500 * k,
                            limitPerMonth: 2000 * k,
                        }

                        await tx.insert(walletSharingLimit).values(newWalletSharingLimit);
                    }
                }
            }
        })


        return {message: 'Seed data inserted successfully'};
    }


    @Get('read-from-secondary-replica')
    @ApiPagination()
    async usersFullEntities(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const users = this.dataSource
            .readDb
            .select({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                passportNumber: user.passportNumber,
                isMarried: user.isMarried,
            })
            .from(user)
            .orderBy(asc(user.id))
            .offset((page - 1) * limit)
            .limit(limit)

        const [{total}] = await this.dataSource
            .readDb
            .select({
                total: count()
            })
            .from(user)

        return {
            data: await users,
            total: total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }


}

