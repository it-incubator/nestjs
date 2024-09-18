import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirstAndLastNameToUser1725105120559 implements MigrationInterface {
    name = 'AddFirstAndLastNameToUser1725105120559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    }

}
