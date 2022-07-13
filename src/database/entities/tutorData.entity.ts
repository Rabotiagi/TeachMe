import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity()
export class TutorData{
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, user => user.id, {onDelete: 'CASCADE'})
    @JoinColumn()
    userId: User

    @Column("simple-array")
    subjects: string[]

    @Column({length: 255})
    description: string

    @Column("simple-array")
    certificates: string[]

    @Column()
    education: string

    @Column()
    experience: string
}