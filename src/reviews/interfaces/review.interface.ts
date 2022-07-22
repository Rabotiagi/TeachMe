import { TutorData } from "src/database/entities/tutorData.entity";
import { Users } from "src/database/entities/users.entity";

export interface iReview {
    tutor: TutorData;
    reviewer: Users;
    review: string;
    grade: number;
}