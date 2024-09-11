import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameDOB1725107377687 implements MigrationInterface {
    name = 'RenameDOB1725107377687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "dob" TO "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" character varying`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "dateOfBirth" TO "dob"`);
    }

}
