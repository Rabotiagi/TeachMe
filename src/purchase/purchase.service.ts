import { Injectable } from '@nestjs/common';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseService {
    constructor(private readonly tutorDataRepo: Repository<TutorData>){}

    async processPurchase(){
        
    }

    private async createSession(){

    }
}
