import { Injectable } from "@nestjs/common";
import AppDataSource from "src/database/connection";
import { Chats } from "src/database/entities/chats.entity";
import { Messages } from "src/database/entities/messages.entity";
import { Users } from "src/database/entities/users.entity";
import { Repository } from "typeorm";
import { iMessage } from "../interfaces/message.interface";

@Injectable()
export class MessagesService {
    constructor(
        private readonly messagesRepo: Repository<Messages>,
        private readonly chatsRepo: Repository<Chats>,
        private readonly accountsRepo: Repository<Users>  
    ){
        this.messagesRepo = AppDataSource.getRepository(Messages);
        this.chatsRepo = AppDataSource.getRepository(Chats);
        this.accountsRepo = AppDataSource.getRepository(Users);
    }

    async createMessage(msgData: iMessage): Promise<iMessage>{
        // const user = await this.accountsRepo.findOneBy();

        const data = this.messagesRepo.create(msgData);
        return await this.messagesRepo.save(data);
    }

    async getChatMessages(chatId: number): Promise<iMessage[]>{
        const chat = await this.chatsRepo.findOneBy({id: chatId});

        const history = await this.messagesRepo.find({
            where:{
                chat: chat as unknown
            }
        });
        console.log(history);

        const res = history.sort((m1, m2) => {
            return new Date(m2.createdAt).getTime() - new Date(m2.createdAt).getTime();
        }).reverse();

        //Implement Message body rendering rendering

        return res;
    }
}