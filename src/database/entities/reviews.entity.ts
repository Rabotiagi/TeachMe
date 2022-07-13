import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.id, {onDelete: 'CASCADE'})
    tutorId: User

    @OneToOne(() => User, user => user.id)
    @JoinColumn()
    reviewerId: User

    @Column({length: 255})
    review: string

    @Column("decimal")
    grade: number
}