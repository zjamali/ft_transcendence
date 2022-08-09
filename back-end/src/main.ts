import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const FrontHost = configService.get<string>('FRONT_HOST_NAME');
  const FrontPort = configService.get<string>('FRONT_PORT');
  const ServerPort = configService.get<string>('SERVER_PORT');

  app.enableCors({
    origin: `http://${FrontHost}:${FrontPort}`,
    credentials: true,
  });

  app.use(cookieParser());
  app.enableShutdownHooks();

  await app.listen(ServerPort);
}
bootstrap();
