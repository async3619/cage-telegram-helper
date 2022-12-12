import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTelegramTables1670854605228 implements MigrationInterface {
    name = "CreateTelegramTables1670854605228";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "telegram_message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "followers" text, "unfollowers" text, "renames" text, "messageId" integer, "userId" varchar)`,
        );
        await queryRunner.query(
            `CREATE TABLE "telegram_user" ("id" varchar PRIMARY KEY NOT NULL, "chatId" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
        );
        await queryRunner.query(
            `CREATE TABLE "temporary_telegram_message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "followers" text, "unfollowers" text, "renames" text, "messageId" integer, "userId" varchar, CONSTRAINT "FK_14ba54fef8fcc9d144c12a51839" FOREIGN KEY ("userId") REFERENCES "telegram_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
        );
        await queryRunner.query(
            `INSERT INTO "temporary_telegram_message"("id", "followers", "unfollowers", "renames", "messageId", "userId") SELECT "id", "followers", "unfollowers", "renames", "messageId", "userId" FROM "telegram_message"`,
        );
        await queryRunner.query(`DROP TABLE "telegram_message"`);
        await queryRunner.query(`ALTER TABLE "temporary_telegram_message" RENAME TO "telegram_message"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telegram_message" RENAME TO "temporary_telegram_message"`);
        await queryRunner.query(
            `CREATE TABLE "telegram_message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "followers" text, "unfollowers" text, "renames" text, "messageId" integer, "userId" varchar)`,
        );
        await queryRunner.query(
            `INSERT INTO "telegram_message"("id", "followers", "unfollowers", "renames", "messageId", "userId") SELECT "id", "followers", "unfollowers", "renames", "messageId", "userId" FROM "temporary_telegram_message"`,
        );
        await queryRunner.query(`DROP TABLE "temporary_telegram_message"`);
        await queryRunner.query(`DROP TABLE "telegram_user"`);
        await queryRunner.query(`DROP TABLE "telegram_message"`);
    }
}
