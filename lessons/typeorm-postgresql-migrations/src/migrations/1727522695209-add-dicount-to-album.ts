import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDicountToAlbum1727522695209 implements MigrationInterface {
  name = 'AddDicountToAlbum1727522695209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" ADD "discount" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "discount"`);
  }
}

// code-first -> sql
// db first -> code
