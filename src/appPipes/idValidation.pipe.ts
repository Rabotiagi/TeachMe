import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import AppDataSource from "src/database/connection";
import { Users } from "src/database/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class IdValidationPipe implements PipeTransform {
    constructor(private readonly accountRepo: Repository<Users>){
        this.accountRepo = AppDataSource.getRepository(Users);
    }

    async transform(value: any, {type}: ArgumentMetadata) {
        if(type !== 'param') return value;
        const res = await this.accountRepo.findOneBy({id: Number(value)});

        if(!res) throw new BadRequestException('Invalid argument data');
        return value;
    }
}