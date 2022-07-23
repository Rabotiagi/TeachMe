import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Repository } from 'typeorm';
import { TriggerService } from './trigger.service';

@Module({
  imports: [AccountsModule],
  providers: [TriggerService, Repository],
  exports: [TriggerService]
})
export class TriggerModule {}
