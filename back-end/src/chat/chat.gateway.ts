import { Server ,Socket } from 'socket.io';
import { GlobalService } from 'src/utils/Global.service';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { EventsService } from 'src/events/events.service';
import { MessagesService } from './messages/messages.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { JwtService } from '@nestjs/jwt';

export type JwtPayload = { id: string; username: string };

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;
  

  constructor(
    private readonly chatService: ChatService ,
    private readonly messagesService: MessagesService,
    private readonly eventsService : EventsService,
    private readonly jwtService: JwtService,
    ) {}
  
  @SubscribeMessage('SEND_MESSAGE')
  async create(@MessageBody() createMessageDto: CreateMessageDto ) {
    console.log(" ✉ message : ",  createMessageDto);
    
    // save message in db
    this.messagesService.create(createMessageDto);
    
    const receiverSockets = GlobalService.UsersChatSockets.get(createMessageDto.receiverId);
    let  targetUserSockets = [...GlobalService.UsersChatSockets.get(createMessageDto.senderId)];
    if (receiverSockets)
       targetUserSockets = [...targetUserSockets, ...receiverSockets];
    console.log("target to send it message :  ", targetUserSockets);
    targetUserSockets.forEach(socket => {
      this.server.to(socket).emit("NEW_MESSAGE", {...createMessageDto});
    });
  }
  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    this.chatService.addUserChatSocket(user_id,client.id);
  }

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: Socket) {
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    this.chatService.removeUserChatSocket(user_id, client.id)
  }

  public getUserIdFromJWT(cookies: string): string {
    const decodedJwtAccessToken: any = this.jwtService.decode(
      this.parseCookie(cookies)['access_token'],
    );
    const jwtPayload: JwtPayload = { ...decodedJwtAccessToken };
    return jwtPayload.id;
  }
  parseCookie(cookies: any) {
    cookies = cookies.split('; ');
    const result = {};
    for (let i in cookies) {
      const cur = cookies[i].split('=');
      result[cur[0]] = cur[1];
    }
    return result;
  }


  /*
  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
  */
}
