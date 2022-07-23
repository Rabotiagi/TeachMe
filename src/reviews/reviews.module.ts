import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TriggerModule } from 'src/trigger/trigger.module';

@Module({
  imports: [TriggerModule],
  providers: [ReviewsService, Repository],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
