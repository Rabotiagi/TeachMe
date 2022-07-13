import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chats.entity";
import { User } from "./users.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Chat, chat => chat.id)
    chatId: Chat

    @ManyToOne(() => User, user => user.id)
    senderId: number

    @Column({length: 255})
    msg: string

    @CreateDateColumn()
    createdAt: Date
}