import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reviews } from "./reviews.entity";
import { Services } from "./services.entity";
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

    @OneToMany(() => Services, service => service.tutor)
    services: Services[];

    @OneToMany(() => Reviews, review => review.tutor)
    reviews: Reviews[]

    @Column({default: 0})
    minPrice: number;

    @Column({default: 0})
    maxPrice: number;
}