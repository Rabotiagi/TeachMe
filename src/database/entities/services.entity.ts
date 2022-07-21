import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TutorData } from "./tutorData.entity";

@Entity()
export class Services{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TutorData, tutorData => tutorData.services)
    @JoinColumn()
    tutor: TutorData

    @Column({
        length: 100
    })
    name: string;

    @Column()
    price: number;

    @Column({default: ''})
    serviceToken: string;
}