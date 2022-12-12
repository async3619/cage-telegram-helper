import { DataSource } from "typeorm";

export default new DataSource({
    type: "sqlite",
    database: "./data.sqlite",
    entities: ["./dist/**/*.model{.ts,.js}"],
    dropSchema: false,
    synchronize: false,
    migrationsRun: true,
    logging: false,
    migrations: ["dist/src/migrations/**/*{.ts,.js}"],
});
