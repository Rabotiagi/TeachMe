import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
  providers: [AccountsService, Repository],
  controllers: [AccountsController],
  exports: [AccountsService]
})
export class AccountsModule {}
