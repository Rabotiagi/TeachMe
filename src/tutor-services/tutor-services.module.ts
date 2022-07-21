import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Repository } from 'typeorm';
import { TutorServicesService } from './tutor-services.service';
import { TutorServicesController } from './tutor-services.controller';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports:[AccountsModule, StripeModule],
  providers: [TutorServicesService, Repository],
  controllers: [TutorServicesController]
})
export class TutorServicesModule {}
