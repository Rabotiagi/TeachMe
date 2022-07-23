import { BadRequestException, Injectable } from '@nestjs/common';
import AppDataSource from 'src/database/connection';
import { Reviews } from 'src/database/entities/reviews.entity';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { Users } from 'src/database/entities/users.entity';
import { TriggerService } from 'src/trigger/trigger.service';
import { DeleteResult, Repository } from 'typeorm';
import { iReview } from './interfaces/review.interface';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly reviewsRepo: Repository<Reviews>,
        private readonly tutorDataRepo: Repository<TutorData>,
        private readonly triggerService: TriggerService
    ){
        this.reviewsRepo = AppDataSource.getRepository(Reviews);
        this.tutorDataRepo = AppDataSource.getRepository(TutorData);
    }

    async getTutorReviews(tutorDataId: number): Promise<iReview[]>{
        const {reviews} = await this.tutorDataRepo.findOne({
            where: {id: tutorDataId},
            relations: {reviews: true}
        });

        const res = [];
        for(let i = 0; i < reviews.length; i++){
            const review = await this.reviewsRepo.findOne({
                where: {id: reviews[i].id},
                relations: {reviewer: true}
            });
            const {firstName, lastName, id} = review.reviewer;

            review.reviewer = {id, firstName, lastName} as Users;
            res.push(review);
        }

        return res;
    }

    async createReview(tutorDataId: number, reviewData: iReview): Promise<iReview>{
        const existingReviews = await this.getTutorReviews(tutorDataId);
        if(existingReviews.find(r => r.reviewer.id === reviewData.reviewer as unknown)){
            throw new BadRequestException('Already reviewed this tutor');
        }

        const tutor = await this.tutorDataRepo.findOneBy({id: tutorDataId});
        
        reviewData.tutor = tutor;
        const data = this.reviewsRepo.create(reviewData);
        const res = await this.reviewsRepo.save(data);

        await this.triggerService.calculateTutorGrade(tutorDataId);
        return res;
    }

    async deleteReview(reviewId: number): Promise<DeleteResult>{
        const { tutor } = await this.reviewsRepo.findOne({
            where: {id: reviewId},
            relations: {tutor: true}
        });

        const res = await this.reviewsRepo.delete(reviewId);
        await this.triggerService.calculateTutorGrade(tutor.id);
        return res;
    }
}
