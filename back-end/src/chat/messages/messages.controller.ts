import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../chat.gateway';
import { Request } from 'express';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Req() req: Request, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @UseGuards(JwtService)
  @Get(':receiverId')
  findOne(@Req() req: Request, @Param('receiverId') receiverId: string) {
    
    const decodedJwtAccessToken: any = this.jwtService.decode(
      req.cookies['access_token'],
    );
    const jwtPayload: JwtPayload = { ...decodedJwtAccessToken };
    console.log('messages user id:  ', jwtPayload.id);

    console.log('queries : ', req.query['isChannel']);
    if (req.query['isChannel']) {
      return this.messagesService.findOne(receiverId,jwtPayload.id, true);
    } 
    else 
    {
      return this.messagesService.findOne(receiverId, jwtPayload.id, false);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
