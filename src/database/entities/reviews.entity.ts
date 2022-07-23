import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TutorData } from "./tutorData.entity";
import { Users } from "./users.entity";

@Entity()
export class Reviews {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TutorData, tutor => tutor.reviews, {onDelete: 'CASCADE'})
    tutor: TutorData;

    @OneToOne(() => Users, user => user.id, {onDelete: 'CASCADE'})
    @JoinColumn()
    reviewer: Users;

    @Column({length: 255})
    review: string;

    @Column("float")
    grade: number;
}