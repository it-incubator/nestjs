import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBalance2ToUser1739705208472 implements MigrationInterface {
    name = 'AddBalance2ToUser1739705208472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "balance2" integer NOT NULL DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "balance2"`);
    }

}
