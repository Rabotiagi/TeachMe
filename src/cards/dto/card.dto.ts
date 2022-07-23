import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Users } from "src/database/entities/users.entity";

export class CardDto {
    @IsString()
    @IsNotEmpty()
    cardNum: string;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    cvc: string;

    @IsOptional()
    user: Users;
}