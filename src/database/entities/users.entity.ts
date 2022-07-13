import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50
    })
    email: string

    @Column()
    password: string

    @Column({
        length: 20
    })
    name: string

    @Column()
    photo: string
}