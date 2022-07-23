import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { TutorServicesModule } from './tutor-services/tutor-services.module';
import { StripeModule } from './stripe/stripe.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TriggerModule } from './trigger/trigger.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [AccountsModule, AuthModule, TutorServicesModule, StripeModule, ReviewsModule, TriggerModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
