import { RoomsService } from './rooms/rooms.service';
import { Server, Socket } from 'socket.io';
import { GlobalService } from 'src/utils/Global.service';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { MessagesService } from './messages/messages.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { JwtService } from '@nestjs/jwt';
import { CreateRoomDto } from './rooms/dto/create-room.dto';

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
    private readonly chatService: ChatService,
    private readonly messagesService: MessagesService,
    // private readonly eventsService : EventsService,
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
  ) {}

  // @UseGuards(JwtAuthGuar0d)
  @SubscribeMessage('CREATE_CHANNEL')
  async createChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() createChannel: CreateRoomDto,
  ) {
    console.log('create room: ', createChannel, ' socket : ', client);
    const imageLink = createChannel.roomType.includes('Private')
      ? '/images/icons/channel_protected.png'
      : '/images/icons/channel_icon.png';
    const room = await this.roomsService.create({
      ...createChannel,
      image: imageLink,
    });
    client.join(room.id);
    this.server.emit('A_CHANNELS_STATUS_UPDATED');
  }

  @SubscribeMessage('CHECK_ROOM_PASSWORD')
  async checkRoomPassword(
    @MessageBody() data: { room_id: string; password: string },
  ) {
    const roomToJoin = await this.roomsService.findOne(Number(data.room_id));
    if (roomToJoin[0].password === data.password) {
      console.log('the password is correct ');
      return true;
    } else {
      console.log('password is incorrect');
      return false;
    }
  }

  @SubscribeMessage('JOIN_ROOM')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() newUserToJoin: { user_id: string; room_id: string },
  ) {
    const roomToJoin = await this.roomsService.findOne(
      Number(newUserToJoin.room_id),
    );
    console.log('join room: ', roomToJoin);
    client.join(newUserToJoin.room_id);
    console.log(
      'someOne is joined : id ',
      newUserToJoin.user_id,
      ' this room : ',
      roomToJoin,
    );
    this.roomsService
      .addUser(Number(newUserToJoin.room_id), newUserToJoin.user_id)
      .then(() => {
        const targetUserSockets = GlobalService.UsersChatSockets.get(
          newUserToJoin.user_id,
        );
        targetUserSockets.forEach((socket) => {
          this.server.to(socket).emit('A_CHANNELS_STATUS_UPDATED');
        });
      });
  }

  @SubscribeMessage('LEAVE_ROOM')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() UserToLeaveRoom: { user_id: string; room_id: string },
  ) {
    const roomToLeave = await this.roomsService.findOne(
      Number(UserToLeaveRoom.room_id),
    );
    console.log('leave room ', roomToLeave);
    client.leave(UserToLeaveRoom.room_id);
    this.roomsService
      .deleteUser(Number(UserToLeaveRoom.room_id), UserToLeaveRoom.user_id)
      .then(() => {
        const targetUserSockets = GlobalService.UsersChatSockets.get(
          UserToLeaveRoom.user_id,
        );
        targetUserSockets.forEach((socket) => {
          this.server.to(socket).emit('A_CHANNELS_STATUS_UPDATED');
        });
      });
  }

  @SubscribeMessage('SEND_MESSAGE')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    if (createMessageDto.isChannel === false) {
      console.log(' ✉ message : ', createMessageDto);
      // save message in db
      this.messagesService.create(createMessageDto);

      const receiverSockets = GlobalService.UsersChatSockets.get(
        createMessageDto.receiverId,
      );
      let targetUserSockets = [
        ...GlobalService.UsersChatSockets.get(createMessageDto.senderId),
      ];
      if (receiverSockets)
        targetUserSockets = [...targetUserSockets, ...receiverSockets];
      console.log('target to send it message :  ', targetUserSockets);
      targetUserSockets.forEach((socket) => {
        this.server.to(socket).emit('NEW_MESSAGE', { ...createMessageDto });
      });
    } else {
      console.log('the message is for a channel ', createMessageDto);
      this.messagesService.create(createMessageDto);
      this.server
        .to(createMessageDto.receiverId)
        .emit('NEW_MESSAGE', { ...createMessageDto });
    }
  }
  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    this.chatService.addUserChatSocket(user_id, client.id);
  }

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: Socket) {
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    this.chatService.removeUserChatSocket(user_id, client.id);
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
    for (const i in cookies) {
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
