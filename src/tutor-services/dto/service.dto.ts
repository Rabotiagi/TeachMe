import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";
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

// TODO: rewrite DTO class for Payment data in request body

// class PurchasItem {
//     @IsNumber()
//     @IsNotEmpty()
//     serviceId: number;

//     @IsNumber()
//     @Min(1)
//     @IsNotEmpty()
//     quantity: number;
// }

// export class PurchaseItemDto {
//     @ValidateNested({ each: true })
//     items: PurchasItem[];
// }