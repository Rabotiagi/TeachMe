import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Repository } from 'typeorm';
import { TutorServicesService } from './tutor-services.service';
import { TutorServicesController } from './tutor-services.controller';
import { StripeModule } from 'src/stripe/stripe.module';
import { TriggerModule } from 'src/trigger/trigger.module';

@Module({
  imports:[AccountsModule, StripeModule, TriggerModule],
  providers: [TutorServicesService, Repository],
  controllers: [TutorServicesController]
})
export class TutorServicesModule {}
