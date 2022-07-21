import { TutorData } from "src/database/entities/tutorData.entity";

export interface iService{
    id?: number;
    tutor: TutorData;
    name: string;
    price: number;
    itemToken: string;
    priceToken: string;
}

export interface iUpdateService{
    name?: string;
    price?: number;
    // itemToken?: string;
    // priceToken?: string;
}