import { Injectable } from '@nestjs/common';
import AppDataSource from 'src/database/connection';
import { Reviews } from 'src/database/entities/reviews.entity';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { DeleteResult, Repository } from 'typeorm';
import { iReview } from './interfaces/review.interface';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly reviewsRepo: Repository<Reviews>,
        private readonly tutorDataRepo: Repository<TutorData>
    ){
        this.reviewsRepo = AppDataSource.getRepository(Reviews);
        this.tutorDataRepo = AppDataSource.getRepository(TutorData);
    }

    async getTutorReviews(tutorId: number): Promise<iReview[]>{
        const {reviews} = await this.tutorDataRepo.findOne({
            where: {id: tutorId},
            relations: {reviews: true}
        });

        return reviews;
    }

    async createReview(tutorId: number, reviewData: iReview): Promise<iReview>{
        const tutor = await this.tutorDataRepo.findOneBy({id: tutorId});
        
        reviewData.tutor = tutor;
        const data = this.reviewsRepo.create(reviewData);
        return await this.reviewsRepo.save(data);
    }

    async deleteReview(reviewId: number): Promise<DeleteResult>{
        return await this.reviewsRepo.delete(reviewId);
    }
}
