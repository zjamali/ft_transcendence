import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import { ShutdownService } from './users/shutdown.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  app.enableShutdownHooks();
  // app.get(ShutdownService).subscribeToShutdown(() => app.close());
  await app.listen(5000);
}
bootstrap();
