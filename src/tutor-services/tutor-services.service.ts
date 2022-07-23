import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import AppDataSource from 'src/database/connection';
import { Services } from 'src/database/entities/services.entity';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { TriggerService } from 'src/trigger/trigger.service';
import { DeleteResult, Repository } from 'typeorm';
import { iPurchaseItem, iService, iUpdateService } from './interfaces/service.interface';

@Injectable()
export class TutorServicesService {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly tutorDataRepo: Repository<TutorData>,
        private readonly servicesRepo: Repository<Services>,
        private readonly stripeService: StripeService,
        private readonly triggerService: TriggerService
    ){
        this.tutorDataRepo = AppDataSource.getRepository(TutorData);
        this.servicesRepo = AppDataSource.getRepository(Services);
    }

    async getServices(userId: number): Promise<iService[]>{
        const {tutorData} = await this.accountsService.getAccountData(userId);
        if(!tutorData) throw new BadRequestException('Missing tutor data');

        const {services} = await this.tutorDataRepo.findOne({
            where: {id: tutorData.id},
            relations: {services: true}
        });
        services.forEach(s => delete s.serviceToken);

        return services;
    }

    async createService(userId: number, serviceData: iService): Promise<iService>{
        const { tutorData, firstName, lastName } = await this
            .accountsService
            .getAccountData(userId);
        if(!tutorData) throw new BadRequestException('Missing tutor data');

        const serviceToken = await this.stripeService.createProductToken(
            serviceData, 
            firstName + ' ' + lastName
        );

        serviceData.serviceToken = serviceToken;
        serviceData.tutor = tutorData as TutorData;
        const data = this.servicesRepo.create(serviceData);
        const res = await this.servicesRepo.save(data);

        await this.triggerService.calculatePriceRange(tutorData.id);
        return res;
    }

    async createCheckout(itemsToBuy: iPurchaseItem[]){
        const purchaseData = [];
        for(let i = 0; i < itemsToBuy.length; i++){
            const { serviceToken } = await this.servicesRepo.findOneBy({id: itemsToBuy[i].serviceId});
            const priceToken = await this.stripeService.getPriceToken(serviceToken);
            purchaseData.push({price: priceToken, quantity: itemsToBuy[i].quantity});
        }
        const checkoutSession = await this.stripeService.getCheckoutSession(purchaseData);
        return checkoutSession.url;
    }

    async updateService(serviceId: number, updateData: iUpdateService): Promise<iService>{
        const oldService = await this.servicesRepo.findOne({
            where: {id: serviceId},
            relations: {tutor: true}
        });

        this.servicesRepo.merge(oldService, updateData);
        const res = await this.servicesRepo.save(oldService);

        if(updateData.price){
            await this.stripeService.updateProductPrice(
                oldService.serviceToken, 
                updateData.price
            );
            await this.triggerService.calculatePriceRange(oldService.tutor.id);
        }

        return res;
    }

    async deleteService(serviceId: number): Promise<DeleteResult>{
        const {tutor, serviceToken} = await this.servicesRepo.findOne({
            where: {id: serviceId},
            relations: {tutor: true}
        });

        await this.stripeService.deleteProduct(serviceToken);
        const res = await this.servicesRepo.delete(serviceId);
        await this.triggerService.calculatePriceRange(tutor.id);

        return res;
    }
}