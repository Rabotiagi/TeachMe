import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import { Users } from './users.entity';

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Users, user => user.id, {onDelete: 'CASCADE'})
    @JoinColumn()
    userId: Users;

    @Column()
    cardNum: string;

    @Column()
    date: string;

    @Column()
    cvc: number;
}