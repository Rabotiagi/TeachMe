import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, user => user.id, {onDelete: 'CASCADE'})
    tutorId: Users;

    @ManyToOne(() => Users, user => user.id, {onDelete: 'CASCADE'})
    userId: Users;
}