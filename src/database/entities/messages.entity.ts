import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chats } from "./chats.entity";
import { Users } from "./users.entity";
import { File } from "./files.entity";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Chats, {onDelete: 'CASCADE'})
    chat: Chats;

    @ManyToOne(() => Users, {onDelete: 'CASCADE'})
    sender: Users;

    @OneToOne(() => File, file => file.msg, {onDelete: 'CASCADE'})
    attachment: File

    @Column({length: 255})
    msg: string;

    @CreateDateColumn()
    createdAt: Date;
}