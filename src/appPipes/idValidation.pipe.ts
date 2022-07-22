import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import AppDataSource from "src/database/connection";
import { Reviews } from "src/database/entities/reviews.entity";
import { Services } from "src/database/entities/services.entity";
import { Users } from "src/database/entities/users.entity";
import { EntityTarget, Repository } from "typeorm";

type DBEntities = Users | Services | Reviews;

@Injectable()
export class IdValidationPipe implements PipeTransform {
    repo: Repository<DBEntities>;

    constructor(entity: EntityTarget<DBEntities>){
        this.repo = AppDataSource.getRepository(entity);
    }

    async transform(value: any, {type}: ArgumentMetadata) {
        if(type !== 'param') return value;
        
        const res = await this.repo.findOneBy({id: Number(value)});
        if(!res) throw new BadRequestException('Invalid parameter data');

        return value;
    }
}