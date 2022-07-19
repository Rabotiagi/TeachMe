import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chats.entity";
import { Users } from "./users.entity";
import { File } from "./files.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Chat, chat => chat.id, {onDelete: 'CASCADE'})
    chatId: Chat;

    @ManyToOne(() => Users, user => user.id, {onDelete: 'CASCADE'})
    senderId: number;

    @OneToOne(() => File, file => file.msg, {onDelete: 'CASCADE'})
    attachment: File

    @Column({length: 255})
    msg: string;

    @CreateDateColumn()
    createdAt: Date;
}