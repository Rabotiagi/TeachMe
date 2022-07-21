require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { iService } from 'src/tutor-services/interfaces/service.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    constructor(private readonly stripe: Stripe){
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2020-08-27'
        });
    }

    private async createProductPrice(productToken: string, price: number){
        await this.stripe.prices.create({
            unit_amount: price,
            currency: 'czk',
            product: productToken
        });
    }

    async createProductToken(serviceData: iService, tutorName: string): Promise<string>{
        const product = await this.stripe.products.create({
            name: serviceData.name,
            description: 'Tutor: ' + tutorName
        });

        await this.createProductPrice(product.id, serviceData.price);

        return product.id;
    }

    async getPriceToken(productToken: string): Promise<string>{
        const { data } = await this.stripe.prices.list({
            product: productToken
        });
        console.log(data);
        return data.filter(price => price.active).pop().id;
    }

    async updateProductPrice(productToken: string, newPrice: number){
        const priceToken = await this.getPriceToken(productToken);
        await this.stripe.prices.update(priceToken, {
            active: false
        });

        await this.createProductPrice(productToken, newPrice);
    }

    async deleteProduct(productToken: string){
        await this.stripe.products.update(productToken, {
            active: false
        });
    }
}
