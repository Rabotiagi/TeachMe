require('dotenv').config();
import { hash } from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import AppDataSource from 'src/database/connection';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { Users } from 'src/database/entities/users.entity';
import { DeleteResult, Repository } from 'typeorm';
import { iAccount, iUpdateAccount } from './interfaces/account.interface';
import { iTutorData } from './interfaces/tutorData.interface';
import { Filter } from './types/filter';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { Response } from 'express';

@Injectable()
export class AccountsService {
    constructor(
        private readonly accountsRepo: Repository<Users>,
        private readonly tutorDataRepo: Repository<TutorData>
    ){
        this.accountsRepo = AppDataSource.getRepository(Users);
        this.tutorDataRepo = AppDataSource.getRepository(TutorData);
    }

    async createAccount(accountData: iAccount): Promise<iAccount>{
        const exists = await this.accountsRepo.findOneBy({email: accountData.email});
        if(exists) throw new BadRequestException('Email is already in use');

        accountData.password = await hash(
            accountData.password, 
            Number(process.env.SALT)
        );

        const user = this.accountsRepo.create(accountData);
        return await this.accountsRepo.save(user);
    }

    async addTutorData(tutorData: iTutorData): Promise<iTutorData>{
        const data = this.tutorDataRepo.create(tutorData);
        const res = await this.tutorDataRepo.save(data);

        return res;
    }

    async uploadAccountPhoto(id: number, fileName: string): Promise<iAccount>{
        const user = await this.getAccountData(id);

        this.accountsRepo.merge(user as Users, {photo: fileName});
        return await this.accountsRepo.save(user);
    }

    async processLogin(email: string): Promise<iAccount>{
        const user = await this.accountsRepo.findOne({
            where:{email}
        });
        return user;
    }

    async getAccountData(id: number): Promise<iAccount>{
        // TODO: try to rewrite to JOINING 3 tables 
        // [USERS, TUTOR_DATA, SERVICES]

        const {password, ...rest} = await this.accountsRepo.findOne({
            relations: {
                tutorData: true
            },
            where: {id}
        });

        // const {password, ...rest} = await this.accountsRepo
        //     .createQueryBuilder('users')
        //     .innerJoin('users.tutorData', 'tutor_data')
        //     .innerJoin('users.tutorData.services', 'td_services')
        //     .where('users.id = :id', {id})
        //     .getOne();

        return rest;
    }

    async getAccountPhoto(id: number, res: Response){
        const {photo} = await this.accountsRepo.findOne({where:{id}});
        const file = createReadStream('./src/database/files/' + photo);

        file.pipe(res);
    }

    async getTutors(filters: Filter): Promise<iTutorData[]>{
        let dbQuery = this.tutorDataRepo
            .createQueryBuilder('tutorData')
            .leftJoinAndSelect('tutorData.user','users');
        
        if(filters.subject) dbQuery = dbQuery.where(
            'tutorData.subjects @> ARRAY[:subject]', 
            {subject: filters.subject}
        );

        if(filters.grade) dbQuery = dbQuery.andWhere(
            'tutorData.grade >= :grade', 
            {grade: filters.grade}
        );

        if(filters.minPrice) dbQuery = dbQuery.andWhere(
            'tutorData.maxPrice >= :minPrice', 
            {minPrice: filters.minPrice}
        );

        if(filters.maxPrice) dbQuery = dbQuery.andWhere(
            'tutorData.minPrice <= :maxPrice', 
            {maxPrice: filters.maxPrice}
        );

        return await dbQuery.getMany();
    }

    async updateAccount(id: number, updateData: iUpdateAccount): Promise<iAccount>{
        const user = await this.getAccountData(id);
        const updateTutorData = updateData.tutorData;
        delete updateData.tutorData;

        if(updateTutorData && user.tutorData){
            const tutorDataOld = await this.tutorDataRepo.findOneBy({id: user.tutorData.id});
            this.tutorDataRepo.merge(tutorDataOld, updateTutorData);
            await this.tutorDataRepo.save(tutorDataOld);
        }

        this.accountsRepo.merge(user as Users, updateData);
        return await this.accountsRepo.save(user);
    }

    async updateAccountPhoto(id: number, newFileName: string): Promise<iAccount>{
        const user = await this.getAccountData(id);
        await rm('./src/database/files/' + user.photo);

        this.accountsRepo.merge(user as Users, {photo: newFileName});
        return await this.accountsRepo.save(user);
    }

    async deleteAccount(id: number): Promise<DeleteResult>{
        return await this.accountsRepo.delete(id);
    }
}
