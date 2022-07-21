import { Module } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Module({
  providers: [StripeService, Stripe],
  exports: [StripeService]
})
export class StripeModule {}
