import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavCityToProfile1739705034518 implements MigrationInterface {
    name = 'AddFavCityToProfile1739705034518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "myFavoriteCity" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "myFavoriteCity"`);
    }

}
