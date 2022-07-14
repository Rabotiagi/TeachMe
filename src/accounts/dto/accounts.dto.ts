import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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