import TypeORM from "typeorm";

export class Initialize1676874874247 implements TypeORM.MigrationInterface {
    name = 'Initialize1676874874247';

    public async up(queryRunner: TypeORM.QueryRunner): Promise<void> {
    	await queryRunner.query(`CREATE TABLE "pets" ("id" SERIAL NOT NULL, "pet_name" text NOT NULL, "image_name" text NOT NULL, "total_score" integer NOT NULL, "total_votes" integer NOT NULL, "submitted_by" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d01e9e7b4ada753c826720bee8b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: TypeORM.QueryRunner): Promise<void> {
    	await queryRunner.query(`DROP TABLE "pets"`);
    }

}
