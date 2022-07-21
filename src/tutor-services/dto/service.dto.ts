import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TutorData } from "src/database/entities/tutorData.entity";

export class ServiceDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsOptional()
    tutor: TutorData;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}

export class UpdateServiceDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    price?: number;
}