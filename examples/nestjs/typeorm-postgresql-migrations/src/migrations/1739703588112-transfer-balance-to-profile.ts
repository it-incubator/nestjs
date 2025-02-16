import { MigrationInterface, QueryRunner } from "typeorm";

export class TransferBalanceToProfile1739703588112 implements MigrationInterface {
    name = 'TransferBalanceToProfile1739703588112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "balance" integer NOT NULL DEFAULT '10'`);

        await queryRunner.query(`
        UPDATE "profile" 
        SET "balance" = "user"."balance"
        FROM "user"
        WHERE "profile"."ownerId" = "user"."id"
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "balance"`);
    }

}
