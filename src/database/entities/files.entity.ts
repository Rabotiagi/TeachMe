import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Messages } from "./messages.entity";

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Messages, msg => msg.attachment, {onDelete: 'CASCADE'})
    @JoinColumn()
    msg: Messages;

    @Column({length: 255})
    path: string;
}