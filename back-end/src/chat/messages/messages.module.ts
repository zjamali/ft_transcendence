import { RoomsService } from './../rooms/rooms.service';
import { RoomsModule } from './../rooms/rooms.module';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import Message from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), RoomsModule],
  controllers: [MessagesController],
  providers: [MessagesService, JwtService, RoomsService],
  exports: [MessagesService, TypeOrmModule],
})
export class MessagesModule {}
