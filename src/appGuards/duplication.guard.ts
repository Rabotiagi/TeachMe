import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import AppDataSource from "src/database/connection";
import { Users } from "src/database/entities/users.entity";
import { Repository } from "typeorm";

const propertiesMap = {
    'cards': 'card',
    'tutor-data': 'tutorData',
    'photo': 'photo'
};

@Injectable()
export class DuplicationGuard implements CanActivate {
    constructor(private readonly accountsRepo: Repository<Users>){
        this.accountsRepo = AppDataSource.getRepository(Users);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { url, user } = context.switchToHttp().getRequest();
        const prop = propertiesMap[url.split('/').pop()];
        
        const exists = await this.accountsRepo.findOne({
            where: {id: user.id},
            relations: {card: true, tutorData: true}
        });
        return !exists[prop];
    }
}