require('dotenv').config();
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

@Injectable()
export class SocketJwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient();
        const jwtToken = client.handshake.headers['token'] as string;

        try {
            this.jwtService.verify(jwtToken, {secret: process.env.JWT_KEY});
        } catch(e) {
            client.disconnect();
            return false;
        }
        
        return true;
    }
}