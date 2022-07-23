import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import AppDataSource from "src/database/connection";
import { Reviews } from "src/database/entities/reviews.entity";
import { Services } from "src/database/entities/services.entity";
import { TutorData } from "src/database/entities/tutorData.entity";
import { EntityTarget, Repository } from "typeorm";

type DBEntities = Services | Reviews;

@Injectable()
export class AuthorshipGuard implements CanActivate {
    repo: Repository<DBEntities>;
    tutorDataRepo: Repository<TutorData>;
    param: 'reviewId' | 'serviceId';
    
    constructor(entity: EntityTarget<DBEntities>){
        this.repo = AppDataSource.getRepository(entity);
        this.tutorDataRepo = AppDataSource.getRepository(TutorData);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {user, params} = context.switchToHttp().getRequest();
        const prop = Object.keys(params).pop();
        const requestedData = await this.repo.findOne({
            where: {id: Number(params[prop])},
            relations: prop === 'serviceId' ? {tutor: true} : {reviewer: true}
        });

        if(prop === 'serviceId') {
            const tutorData = await this.tutorDataRepo.findOne({
                where: {id: requestedData.tutor.id},
                relations: {user: true}
            });
            return user.id === tutorData.user.id;
        }

        return user.id === (requestedData as Reviews).reviewer.id;
    }
}