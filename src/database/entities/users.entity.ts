import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Card } from "./cards.entity";
import { TutorData } from "./tutorData.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    email: string;

    @Column()
    password: string;

    @Column({
        length: 20
    })
    firstName: string;

    @Column({
        length: 20
    })
    lastName: string;

    @OneToOne(() => TutorData, tutorData => tutorData.user)
    tutorData: TutorData

    @OneToOne(() => Card, card => card.user)
    card: Card

    @Column({
        nullable: true
    })
    photo?: string;
}