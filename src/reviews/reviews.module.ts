import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  providers: [ReviewsService, Repository],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
