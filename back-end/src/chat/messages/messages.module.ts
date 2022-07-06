import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import Message from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports : [TypeOrmModule.forFeature([Message])],
  controllers: [MessagesController],
  providers: [MessagesService, JwtService],
  exports : [MessagesService, TypeOrmModule]
})
export class MessagesModule {}
