import { Injectable } from "@nestjs/common";
import AppDataSource from "src/database/connection";
import { Chats } from "src/database/entities/chats.entity";
import { Users } from "src/database/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatsService{
    constructor(
        private readonly accountsRepo: Repository<Users>,
        private readonly chatsRepo: Repository<Chats>,
    ){
        this.accountsRepo = AppDataSource.getRepository(Users);
        this.chatsRepo = AppDataSource.getRepository(Chats);

    }

    async createChat(userIds: number[]){
        const data = this.chatsRepo.create({users: userIds});
        return await this.chatsRepo.save(data);
    }

    async getUserChats(id: number): Promise<{users: number[]}[]>{
        return await this.chatsRepo.createQueryBuilder('chats')
            .where('chats.users @> ARRAY[:id::int]', {id})
            .getMany();
    }

    async deleteChat(chatId: number){
        return await this.chatsRepo.delete(chatId);
    }
}