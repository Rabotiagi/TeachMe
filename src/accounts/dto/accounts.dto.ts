import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { UpdateTutorDataDto } from "./tutorData.dto";

export class AccountDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsOptional()
    photo?: string;
}

export class UpdateAccountDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    password?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    photo?: string;

    @IsObject()
    @IsOptional()
    tutorData: UpdateTutorDataDto
}