import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class TutorData{
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Users, user => user.tutorData, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: Users;

    @Column({
        type: 'text',
        array: true
    })
    subjects: string[];

    @Column({length: 255})
    description: string;

    @Column("simple-array")
    certificates: string[];

    @Column()
    education: string;

    @Column()
    experience: string;

    @Column("decimal")
    grade: number;

    @Column()
    minPrice: number;

    @Column()
    maxPrice: number;
}