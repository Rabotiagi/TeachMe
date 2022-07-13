import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import { User } from './users.entity';

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, user => user.id, {onDelete: 'CASCADE'})
    @JoinColumn()
    userId: User

    @Column()
    cardNum: string

    @Column()
    date: string

    @Column()
    cvc: number
}