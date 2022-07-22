import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { TutorData } from "src/database/entities/tutorData.entity";
import { Users } from "src/database/entities/users.entity";

export class ReviewDto {
    @IsOptional()
    tutor: TutorData;

    @IsOptional()
    reviewer: Users;

    @IsString()
    @IsNotEmpty()
    review: string;

    @IsNumber()
    @IsNotEmpty()
    @Max(5)
    @Min(1)
    grade: number;
}