import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, user => user.id, {onDelete: 'CASCADE'})
    tutorId: Users;

    @OneToOne(() => Users, user => user.id)
    @JoinColumn()
    reviewerId: Users;

    @Column({length: 255})
    review: string;

    @Column("decimal")
    grade: number;
}