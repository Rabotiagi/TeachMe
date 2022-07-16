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

    @OneToOne(() => Users, user => user.card, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: Users;

    @Column()
    cardNum: string;

    @Column()
    date: string;

    @Column()
    cvc: number;
}