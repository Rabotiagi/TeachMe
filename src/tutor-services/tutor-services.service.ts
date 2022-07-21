import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import AppDataSource from 'src/database/connection';
import { Services } from 'src/database/entities/services.entity';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { DeleteResult, Repository } from 'typeorm';
import { iService, iUpdateService } from './interfaces/service.interface';

@Injectable()
export class TutorServicesService {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly tutorDataRepo: Repository<TutorData>,
        private readonly servicesRepo: Repository<Services>
    ){
        this.tutorDataRepo = AppDataSource.getRepository(TutorData);
        this.servicesRepo = AppDataSource.getRepository(Services);
    }

    private async updatePriceRange(tutorDataId: number, newData: iService | iUpdateService){
        const tutorData = await this.tutorDataRepo.findOne({
            where: {id: tutorDataId},
            relations: {user: true}
        });
        const { minPrice, maxPrice } = tutorData;

        tutorData.minPrice = minPrice > newData.price ? newData.price : minPrice;
        tutorData.maxPrice = maxPrice < newData.price ? newData.price : maxPrice;

        await this.accountsService.updateAccount(tutorData.user.id, {tutorData});
    }

    private async calculatePriceRange(tutorDataId: number){
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

    async getServices(tutorId: number): Promise<iService[]>{
        const {tutorData} = await this.accountsService.getAccountData(tutorId);
        if(!tutorData) throw new BadRequestException('Missing tutor data');

        const {services} = await this.tutorDataRepo.findOne({
            where: {id: tutorData.id},
            relations: {services: true}
        });
        return services;
    }

    async createService(tutorId: number, serviceData: iService): Promise<iService>{
        const { tutorData } = await this.accountsService.getAccountData(tutorId);
        if(!tutorData) throw new BadRequestException('Missing tutor data');

        await this.updatePriceRange(tutorData.id, serviceData);

        serviceData.tutor = tutorData as TutorData;
        const data = this.servicesRepo.create(serviceData);
        return await this.servicesRepo.save(data);
    }

    async updateService(serviceId: number, updateData: iUpdateService): Promise<iService>{
        const oldService = await this.servicesRepo.findOne({
            where: {id: serviceId},
            relations: {tutor: true}
        });
        if(updateData.price) await this.updatePriceRange(oldService.tutor.id, updateData);

        this.servicesRepo.merge(oldService, updateData);
        return await this.servicesRepo.save(oldService);
    }

    async deleteService(serviceId: number): Promise<DeleteResult>{
        const {tutor} = await this.servicesRepo.findOne({
            where: {id: serviceId},
            relations: {tutor: true}
        });

        const res = await this.servicesRepo.delete(serviceId);
        await this.calculatePriceRange(tutor.id);

        return res;
    }
}
