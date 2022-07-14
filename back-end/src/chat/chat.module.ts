import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';
import { EventsService } from './../events/events.service';
import { MessagesService } from './messages/messages.service';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { EventsModule } from 'src/events/events.module';
import { MessagesModule } from './messages/messages.module';
import { JwtService } from '@nestjs/jwt';
import { RoomsService } from './rooms/rooms.service';


@Module({
  imports: [UsersModule, MessagesModule, EventsModule, RoomsModule],
  providers: [ChatGateway, ChatService, MessagesService, EventsService, JwtService, RoomsService]
})
export class ChatModule {}
