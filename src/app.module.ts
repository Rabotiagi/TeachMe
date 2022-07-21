import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { PurchaseModule } from './purchase/purchase.module';
import { TutorServicesModule } from './tutor-services/tutor-services.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [AccountsModule, AuthModule, PurchaseModule, TutorServicesModule, StripeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
