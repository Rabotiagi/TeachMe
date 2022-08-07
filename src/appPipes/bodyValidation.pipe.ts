import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import AppDataSource from "src/database/connection";
import { Users } from "src/database/entities/users.entity";
import { EntityTarget, Repository } from "typeorm";

type DBEntities = Users;
type BodyChecker = (repo: Repository<DBEntities>, body: any) => Promise<boolean>;

@Injectable()
export class BodyValidationPipe implements PipeTransform {
    checker: BodyChecker;
    repo: Repository<DBEntities>;

    constructor(entity: EntityTarget<DBEntities>,  checkingFn: BodyChecker){
        this.checker = checkingFn;
        this.repo = AppDataSource.getRepository(entity);
    }

    async transform(value: any, {type}: ArgumentMetadata) {
        if(type !== 'body') return value;

        const flag = await this.checker(this.repo, value);
        if(!flag) throw new BadRequestException('Invalid request body data');

        return value;
    }
}