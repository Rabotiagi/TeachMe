import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class RefTokens {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    refToken: string;

    @OneToOne(() => Users)
    @JoinColumn()
    user: Users;
}