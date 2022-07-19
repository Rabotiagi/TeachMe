import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./messages.entity";

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Message, msg => msg.attachment, {onDelete: 'CASCADE'})
    @JoinColumn()
    msg: Message;

    @Column({length: 255})
    path: string;
}