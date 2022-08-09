import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://192.168.99.121:3000',
    credentials: true,
  });

  app.use(cookieParser());
  app.enableShutdownHooks();

  await app.listen(5000);
}
bootstrap();
