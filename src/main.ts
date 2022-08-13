require('dotenv').config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppDataSource from './database/connection';
import { existsSync, mkdirSync } from 'fs';
import { SocketIoAdapter } from './messenger/adapters/socket-io.adapter';

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch(err => console.log(err));

if(!existsSync(process.env.FILE_STORAGE)) mkdirSync(process.env.FILE_STORAGE);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  await app.listen(3000);
}
bootstrap();
