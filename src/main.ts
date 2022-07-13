import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppDataSource from './database/connection';

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch(err => console.log(err));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
