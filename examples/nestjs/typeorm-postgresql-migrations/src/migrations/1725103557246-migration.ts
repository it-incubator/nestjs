import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1725103557246 implements MigrationInterface {
  name = 'Migration1725103557246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" RENAME COLUMN "limit" TO "limits"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" RENAME COLUMN "limits" TO "limit"`,
    );
  }
}
