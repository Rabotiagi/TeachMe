import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthorshipGuard } from 'src/appGuards/authorship.guard';
import { JwtGuard } from 'src/appGuards/jwt-auth.guard';
import { IdValidationPipe } from 'src/appPipes/idValidation.pipe';
import { Reviews } from 'src/database/entities/reviews.entity';
import { TutorData } from 'src/database/entities/tutorData.entity';
import { ReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@UseGuards(JwtGuard)
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService){}

    @Get(':tutorDataId')
    @UsePipes(new IdValidationPipe(TutorData))
    async getReviews(@Param('tutorDataId') id: number){
        return await this.reviewsService.getTutorReviews(id);
    }

    @Post(':tutorDataId')
    @UsePipes(new IdValidationPipe(TutorData))
    async createReview(@Req() req, @Param('tutorDataId') id: number, @Body() reviewData: ReviewDto){
        reviewData.reviewer = req.user.id;
        return await this.reviewsService.createReview(id, reviewData);
    }

    @Delete(':reviewId')
    @UseGuards(new AuthorshipGuard(Reviews))
    @UsePipes(new IdValidationPipe(Reviews))
    async deleteReview(@Param('reviewId') id: number){
        return await this.reviewsService.deleteReview(id);
    }
}
