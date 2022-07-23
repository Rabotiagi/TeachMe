import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DuplicationGuard } from 'src/appGuards/duplication.guard';
import { JwtGuard } from 'src/appGuards/jwt-auth.guard';
import { CardsService } from './cards.service';
import { CardDto } from './dto/card.dto';

@Controller('cards')
@UseGuards(JwtGuard)
export class CardsController {
    constructor(private readonly cardsService: CardsService){}

    @Get()
    async getUserCard(@Req() req){
        return await this.cardsService.getCardData(req.user.id);
    }

    @Post()
    @UseGuards(DuplicationGuard)
    async postCard(@Req() req, @Body() body: CardDto){
        body.user = req.user.id;
        return await this.cardsService.createCart(body);
    }

    @Delete()
    async deleteCardData(@Req() req){
        return await this.cardsService.deleteCard(req.user.id);
    }
}
