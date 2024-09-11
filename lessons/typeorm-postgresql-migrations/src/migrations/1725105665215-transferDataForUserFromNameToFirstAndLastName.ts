import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransferDataForUserFromNameToFirstAndLastName1725105665215
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE "user"
            SET "firstName" = split_part("name", ' ', 1),
                "lastName" = split_part("name", ' ', 2)
            WHERE "firstName" IS NULL OR "firstName" = ''
              AND "lastName" IS NULL OR "lastName" = '';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
