require('dotenv').config();
import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Repository } from 'typeorm';
import { ChatsGateway } from './chats/chats.gateway';
import { ChatsService } from './chats/chats.service';

@Module({
    imports: [AccountsModule, JwtModule.register({
        secret: process.env.JWT_KEY
    })],
    providers: [ChatsGateway, Repository, Logger, ChatsService]
})
export class MessengerModule {}
