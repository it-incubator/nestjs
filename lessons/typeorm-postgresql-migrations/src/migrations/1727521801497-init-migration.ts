import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1727521801497 implements MigrationInterface {
    name = 'InitMigration1727521801497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "balance" integer NOT NULL, "limits" integer NOT NULL, "walletTitle" character varying NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "ownerId" integer, CONSTRAINT "REL_552aa6698bb78970f6569161ec" UNIQUE ("ownerId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "dateOfBirth" TIMESTAMP, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying, "balance" integer NOT NULL DEFAULT '10', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "album" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "extraTitle" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "ownerId" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "photo_albums_album" ("photoId" integer NOT NULL, "albumId" integer NOT NULL, CONSTRAINT "PK_3dfdd80a516c2d78b3e85c3ab62" PRIMARY KEY ("photoId", "albumId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5575c9ce23e197fa7f2112196e" ON "photo_albums_album" ("photoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_285581054352d35a478ec60964" ON "photo_albums_album" ("albumId") `);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_552aa6698bb78970f6569161ec0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_f353bfecac9a367c89d293b4508" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photo_albums_album" ADD CONSTRAINT "FK_5575c9ce23e197fa7f2112196e8" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "photo_albums_album" ADD CONSTRAINT "FK_285581054352d35a478ec60964d" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo_albums_album" DROP CONSTRAINT "FK_285581054352d35a478ec60964d"`);
        await queryRunner.query(`ALTER TABLE "photo_albums_album" DROP CONSTRAINT "FK_5575c9ce23e197fa7f2112196e8"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_f353bfecac9a367c89d293b4508"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_552aa6698bb78970f6569161ec0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_285581054352d35a478ec60964"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5575c9ce23e197fa7f2112196e"`);
        await queryRunner.query(`DROP TABLE "photo_albums_album"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
