import entities from 'src';
import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { JwtAuthModule } from './auth/jwt-auth.module';
import { RoomsModule } from './chat/rooms/rooms.module';
import { ShutDownModule } from './users/shutdown.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesModule } from './chat/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    JwtAuthModule,
    EventsModule,
    MessagesModule,
    RoomsModule,
    ChatModule,
    ScheduleModule.forRoot(), ///Holy semicolon: What is this??
    ShutDownModule,
    GameModule,
  ],
})
export class AppModule {}
