import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Chat } from "./entity/Chat";

export const port = 3000;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User, Chat],
    migrations: [],
    subscribers: [],
})
