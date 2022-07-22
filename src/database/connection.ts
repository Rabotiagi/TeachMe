require("dotenv").config();
import "reflect-metadata";
import {DataSource} from 'typeorm';
import { Card } from "./entities/cards.entity";
import { Chat } from "./entities/chats.entity";
import { Message } from "./entities/messages.entity";
import { Reviews } from "./entities/reviews.entity";
import { TutorData } from "./entities/tutorData.entity";
import { Users } from "./entities/users.entity";
import { File } from "./entities/files.entity";
import { RefTokens } from "./entities/refTokens.entity";
import { Services } from "./entities/services.entity";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    entities: [Users, TutorData, Reviews, Message, File, Chat, Card, RefTokens, Services],
    synchronize: true,
    logging: true,
});

export default AppDataSource;