import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        array: true
    })
    users: number[];
}