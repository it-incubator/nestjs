import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWalletTitleColumnToWallet1725104394059 implements MigrationInterface {
    name = 'AddWalletTitleColumnToWallet1725104394059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "walletTitle" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "walletTitle"`);
    }

}
