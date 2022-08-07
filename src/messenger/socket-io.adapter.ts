require('dotenv').config();
import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";

export class SocketIoAdapter extends IoAdapter{
    constructor(private readonly app: INestApplicationContext){
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const clientPort = process.env.PORT;

        const cors = {
            origin: [
                `http://localhost:${clientPort}`,
                new RegExp(`/^http:\/\/192\.168\.1\.([1-9][1-9]\d):${clientPort}$/`),
            ],
        };

        console.log('CORS OPTIONS ----> ', cors);

        const optionsWithCors = {
            ... options,
            cors
        };

        return super.createIOServer(port, optionsWithCors);
    }
}