import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min } from "class-validator";
import { Users } from "src/database/entities/users.entity";

export class TutorDataDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsObject()
    @IsNotEmpty()
    user: Users;

    @IsString({each: true})
    @IsNotEmpty()
    subjects: string[];
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString({each: true})
    @IsNotEmpty()
    certificates: string[];

    @IsString()
    @IsNotEmpty()
    education: string;

    @IsString()
    @IsNotEmpty()
    experience: string;

    @IsNumber()
    @Max(5)
    @Min(0)
    grade: number;
}

export class UpdateTutorDataDto {
    @IsString({each: true})
    @IsNotEmpty()
    @IsOptional()
    subjects?: string[];
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @IsString({each: true})
    @IsNotEmpty()
    @IsOptional()
    certificates?: string[];

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    education?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    experience?: string;

    @IsNumber()
    @Max(5)
    @Min(0)
    @IsOptional()
    grade?: number;
}