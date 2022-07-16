import { Injectable } from '@nestjs/common';
import AppDataSource from 'src/database/connection';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { Users } from 'src/database/entities/users.entity';
import { encryptData } from 'src/utils/encryption';
import { DeleteResult, Repository } from 'typeorm';
import { iAccount, iUpdateAccount } from './interfaces/account.interface';
import { iTutorData } from './interfaces/tutorData.interface';

type Filter = {
    subject: string
};

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
        accountData.password = encryptData(accountData.password);

        const user = this.accountsRepo.create(accountData);
        return await this.accountsRepo.save(user);
    }

    async addTutorData(tutorData: iTutorData): Promise<iTutorData>{
        const data = this.tutorDataRepo.create(tutorData);
        const res = await this.tutorDataRepo.save(data);

        return res;
    }

    async checkPassword(email: string): Promise<string>{
        const user = await this.accountsRepo.findOne({
            where:{email}
        });
        return user.password;
    }

    async getAccountData(id: number): Promise<iAccount>{
        const user = await this.accountsRepo.findOne({
            relations: {
                tutorData: true
            },
            where: {id}
        });
        return user;
    }

    async getTutors(filters: Filter): Promise<iTutorData[]>{
        return await this.tutorDataRepo
            .createQueryBuilder('tutorData')
            .leftJoinAndSelect('tutorData.user','users')
            .where('tutorData.subjects @> ARRAY[:subject]', {subject: filters.subject})
            .getMany();
    }

    async updateAccount(id: number, data: iUpdateAccount): Promise<iAccount>{
        const user = await this.getAccountData(id);
        const updateTutorData = data.tutorData;
        delete data.tutorData;

        if(updateTutorData){
            console.log(data);
            const tutorDataOld = await this.tutorDataRepo.findOneBy({id: user.tutorData.id});
            this.tutorDataRepo.merge(tutorDataOld, updateTutorData);
            await this.tutorDataRepo.save(tutorDataOld);
        }


        this.accountsRepo.merge(user as Users, data);
        return await this.accountsRepo.save(user);
    }

    async deleteAccount(id: number): Promise<DeleteResult>{
        const results = await this.accountsRepo.delete(id);
        return results;
    }
}
