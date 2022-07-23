import { TutorData } from "src/database/entities/tutorData.entity";

export interface iService{
    id?: number;
    tutor: TutorData;
    name: string;
    price: number;
    serviceToken: string;
}

export interface iUpdateService{
    name?: string;
    price?: number;
}

export interface iPurchaseItem{
    serviceId: number;
    quantity: number;
}