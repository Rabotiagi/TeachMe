import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import AppDataSource from 'src/database/connection';
import { Services } from 'src/database/entities/services.entity';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TriggerService {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly tutorDataRepo: Repository<TutorData>,
        private readonly servicesRepo: Repository<Services>
    ){
        this.tutorDataRepo = AppDataSource.getRepository(TutorData);
        this.servicesRepo = AppDataSource.getRepository(Services);
    }

    async calculatePriceRange(tutorDataId: number){
        const servicesQueryBuilder = this.servicesRepo
            .createQueryBuilder('services')
            .leftJoin('services.tutor', 'tutorId')
            .where('services.tutor = :tutorDataId', {tutorDataId});
        
        const {min: minPrice} = await servicesQueryBuilder
            .select('MIN(services.price)', 'min')
            .getRawOne();

        const {max: maxPrice} = await servicesQueryBuilder
            .select('MAX(services.price)', 'max')
            .getRawOne();

        const {user} = await this.tutorDataRepo.findOne({
            where: {id: tutorDataId},
            relations: {user: true}
        });

        await this.accountsService.updateAccount(user.id, {
            tutorData:{
                minPrice: minPrice as number || 0,
                maxPrice: maxPrice as number || 0
            }
        });
    }

    async calculateTutorGrade(tutorDataId: number){
        const { reviews, user } = await this.tutorDataRepo.findOne({
            where: {id: tutorDataId},
            relations: {reviews: true, user: true}
        });

        const sum = reviews.reduce((total, next) => total + next.grade, 0);
        const avg = sum ? sum / reviews.length : 0;

        await this.accountsService.updateAccount(user.id, {
            tutorData: {grade: Number(avg.toFixed(1))}
        });
    }
}
