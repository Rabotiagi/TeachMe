import { Chats } from "src/database/entities/chats.entity";
import { File } from "src/database/entities/files.entity";
import { Users } from "src/database/entities/users.entity";

export interface iMessage {
    id?: number;
    chat: Chats;
    sender: Users;
    attachment?: File;
    msg: string;
    createdAt?: Date;
}