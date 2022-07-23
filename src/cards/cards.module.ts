import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';

@Module({
  providers: [CardsService, Repository],
  controllers: [CardsController]
})
export class CardsModule {}
