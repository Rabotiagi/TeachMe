import { Services } from "src/database/entities/services.entity";
import { Users } from "src/database/entities/users.entity";

export interface iTutorData{
    id?: number;
    user: Users;
    subjects: string[];
    description: string;
    certificates: string[];
    education: string;
    experience: string;
    grade: number;
    services: Services[];
}

export interface iUpdateTutorData {
    subjects?: string[];
    description?: string;
    certificates?: string[];
    education?: string;
    experience?: string;
    grade?: number;
    minPrice?: number;
    maxPrice?: number;
}