import { Users } from "src/database/entities/users.entity";

export interface iCard {
    id?: number;
    user: Users;
    cardNum: string;
    date: string;
    cvc: string;
}