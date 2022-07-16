import { iTutorData, iUpdateTutorData } from "./tutorData.interface";

export interface iAccount{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    photo?: string;
    tutorData?: iTutorData;
}

export interface iUpdateAccount{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    tutorData?: iUpdateTutorData
}