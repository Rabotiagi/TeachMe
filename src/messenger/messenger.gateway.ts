import { Logger, UseGuards, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { 
    MessageBody, 
    SubscribeMessage, 
    WebSocketGateway, 
    WebSocketServer, 
    OnGatewayDisconnect, 
    OnGatewayConnection,
    ConnectedSocket
} from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { SocketJwtGuard } from "src/appGuards/socket-auth.guard";
import { BodyValidationPipe } from "src/appPipes/bodyValidation.pipe";
import { Users } from "src/database/entities/users.entity";
import { Repository } from "typeorm";
import { iMessage } from "./interfaces/message.interface";
import { ChatsService } from "./services/chats.service";
import { MessagesService } from "./services/messages.service";

@WebSocketGateway({
    namespace: 'chats'
})
@UseGuards(SocketJwtGuard)
export class MessengerGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private readonly chatsService: ChatsService,
        private readonly jwtService: JwtService,
        private readonly messagesService: MessagesService
    ){}

    private readonly logger = new Logger(MessengerGateway.name);

    @WebSocketServer()
    io: Namespace;

    @SubscribeMessage('joinChat')
    async joinChat(@ConnectedSocket() client: Socket, @MessageBody('chatId') chatId: number){
        client.join(chatId.toString());

        const msgHistory = await this.messagesService.getChatMessages(chatId);
        client.emit('history', msgHistory);
    }

    @SubscribeMessage('getChats')
    async getChats(@ConnectedSocket() client: Socket, @MessageBody('id') id: number){
        const chats = await this.chatsService.getUserChats(id);
        client.emit('userChats', chats);
    }

    @SubscribeMessage('createChat')
    @UsePipes(new BodyValidationPipe(
        Users, 
        async (repo: Repository<Users>, body: {users: number[]}) => {
            for(let i = 0; i < body.users.length; i++){
                const user = await repo.findOneBy({id: body.users[i]});
                if(!user) return false;
            }

            return true;
        }
    ))
    async createChat(@ConnectedSocket() client: Socket, @MessageBody() data: {users: number[]}){
        const res = await this.chatsService.createChat(data.users);
        client.emit('newChat', res);
    }

    @SubscribeMessage('deleteChat')
    async deleteChat(@MessageBody('chatId') chatId: number){
        await this.chatsService.deleteChat(chatId);
        // ref chats
    }

    @SubscribeMessage('chatMessage')
    async chatMessage(@MessageBody() body: iMessage){
        const message = await this.messagesService.createMessage(body);
        console.log(message);
        this.io.to(message.chat.toString()).emit('newMessage', message);
        // Implement updating chats
    }

    handleConnection(client: Socket) {
        const token = client.handshake.headers['token'] as string;
        try{
            this.jwtService.verify(token, {secret: process.env.JWT_TOKEN});
        } catch {
            client.disconnect();
        }

        const sockets = this.io.sockets;
        this.logger.log(`New socket ${client.id} has connected`);
        this.logger.log(`Number of sockets -----> ${sockets.size}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log('Disconnection of socket');
    }
}