import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PurchaseService } from './purchase.service';

@Module({
  providers: [PurchaseService, Repository]
})
export class PurchaseModule {}
