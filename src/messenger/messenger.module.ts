require('dotenv').config();
import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Repository } from 'typeorm';
import { MessengerGateway } from './messenger.gateway';
import { ChatsService } from './services/chats.service';
import { MessagesService } from './services/messages.service';

@Module({
    imports: [AccountsModule, JwtModule.register({
        secret: process.env.JWT_KEY
    })],
    providers: [
        MessengerGateway, 
        Repository, 
        Logger, 
        ChatsService,
        MessagesService
    ]
})
export class MessengerModule {}
