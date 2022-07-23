import { BadRequestException, Injectable } from '@nestjs/common';
import AppDataSource from 'src/database/connection';
import { Cards } from 'src/database/entities/cards.entity';
import { Users } from 'src/database/entities/users.entity';
import { encryptData } from 'src/utils/encryption';
import { DeleteResult, Repository } from 'typeorm';
import { iCard } from './interfaces/card.interface';

@Injectable()
export class CardsService {
    constructor(
        private readonly cardsRepo: Repository<Cards>,
        private readonly accountsRepo: Repository<Users>
    ){
        this.cardsRepo = AppDataSource.getRepository(Cards);
        this.accountsRepo = AppDataSource.getRepository(Users);
    }

    async getCardData(userId: number): Promise<iCard>{
        const { card } = await this.accountsRepo.findOne({
            where: {id: userId},
            relations: {card: true}
        });
        return card;
    }

    async createCart(cardData: iCard): Promise<iCard>{
        Object.keys(cardData).forEach(prop => {
            if(prop === 'user') return;
            cardData[prop] = encryptData(cardData[prop]);
        });

        const data = this.cardsRepo.create(cardData);
        return await this.cardsRepo.save(data);
    }

    async deleteCard(userId: number): Promise<DeleteResult>{
        const { card } = await this.accountsRepo.findOne({
            where: {id: userId},
            relations: {card: true}
        });

        if(!card) throw new BadRequestException('Card does not exist');
        return await this.cardsRepo.delete(card.id);
    }
}
