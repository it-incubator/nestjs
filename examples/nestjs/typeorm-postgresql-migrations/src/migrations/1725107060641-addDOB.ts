import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDOB1725107060641 implements MigrationInterface {
  name = 'AddDOB1725107060641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "dob" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dob"`);
  }
}
