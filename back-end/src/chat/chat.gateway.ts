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
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
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
    private readonly schedulerRegistry: SchedulerRegistry,
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
      ? '/images/icons/channel_private.png'
      : '/images/icons/channel_icon.png';
    let room;
    if (createChannel.isProtected) {
      const hashedPassword = await GlobalService.hashPassword(
        createChannel.password,
      );
      room = await this.roomsService.create({
        ...createChannel,
        image: imageLink,
        password: hashedPassword,
      });
    } else {
      room = await this.roomsService.create({
        ...createChannel,
        image: imageLink,
      });
    }
    client.join(room.id);
    this.server.emit('A_CHANNELS_STATUS_UPDATED');
  }

  @SubscribeMessage('CHECK_ROOM_PASSWORD')
  async checkRoomPassword(
    @MessageBody() data: { room_id: string; password: string },
  ) {
    const roomToJoin = await this.roomsService.findOne(Number(data.room_id));
    const isMatch = await GlobalService.CheckPassword(
      data.password,
      roomToJoin[0].password,
    );
    if (isMatch) {
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
  //// manage a channel
  @SubscribeMessage('ROOM_ADMINS_STATUS')
  async roomAdmins(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string; new_admins: string[] },
  ) {
    const room = await this.roomsService.findOne(Number(roomUpdate.room_id));
  }
  @SubscribeMessage('ROOM_REMOVE_PASSWORD')
  async removePassword(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string },
  ) {
    const room = await this.roomsService.findOne(Number(roomUpdate.room_id));
    if (room[0].owner !== roomUpdate.admin_id) {
      await this.roomsService.removePassword(roomUpdate.room_id);
      setTimeout(() => {
        this.server.emit('A_CHANNELS_STATUS_UPDATED');
      }, 500);
    }
  }
  @SubscribeMessage('ROOM_MUTE_USERS')
  async muteUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: {
      admin_id: string;
      room_id: string;
      muted_user: any[];
      timeToMute: number;
    },
  ) {
    const room = await this.roomsService.findOne(Number(roomUpdate.room_id));
    if (!room[0].admins.includes(roomUpdate.admin_id)) return;

    const mutedUser = roomUpdate.muted_user.map((user) => {
      return user.value;
    });
    const alreadyMutedUser = room[0].mutedUsers;

    await this.roomsService.muteUsers(roomUpdate.room_id, mutedUser);
    if (alreadyMutedUser?.length < mutedUser.length) {
      console.log('some unmuted :');
    }
    const newRoom = await this.roomsService.findOne(Number(roomUpdate.room_id));
    this.server.emit('USER_GET_MUTED', { ...newRoom[0] });
  }
  @SubscribeMessage('ROOM_BAN_A_USER')
  async roomBannedUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string; banned: any[] },
  ) {
    const room = await this.roomsService.findOne(Number(roomUpdate.room_id));
    // check if request owner is admin
    if (!room[0].admins.includes(roomUpdate.admin_id)) return;
    console.log('ban: ', roomUpdate.banned);

    const bannedUserIds = roomUpdate.banned.map((user) => {
      return user.value;
    });
    /// if admin is not owner and wanna ban a other admin
    if (room[0].owner !== roomUpdate.admin_id) {
      room[0].admins.forEach((admin) => {
        if (bannedUserIds.includes(admin)) return;
      });
    }

    await this.roomsService.bannedUser(
      Number(roomUpdate.room_id),
      bannedUserIds,
    );
    roomUpdate.banned.forEach((bannesUser) => {
      const userChatSocketsIds = GlobalService.UsersChatSockets.get(
        bannesUser.value,
      );
      userChatSocketsIds.forEach(async (socketId) => {
        const user_socket = GlobalService.Sockets.get(socketId);
        if (user_socket) {
          user_socket.leave(roomUpdate.room_id);
          const targetUserSockets = GlobalService.UsersChatSockets.get(
            bannesUser.value,
          );
          targetUserSockets.forEach((socket) => {
            this.server.to(socket).emit('A_CHANNELS_YOU_BANNED', {
              room_id: roomUpdate.room_id,
            });
          });
        }
      });
    });
    setTimeout(() => {
      this.server.emit('A_CHANNELS_STATUS_UPDATED');
    }, 1000);
  }
  @SubscribeMessage('ROOM_KICKED_USER')
  async rommKickedUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string; new_kicked: any },
  ) {
    console.log('user to kick :', roomUpdate.new_kicked);
    // const room = await this.roomsService.findOne(Number(roomUpdate.room_id));
    const userChatSocketsIds = GlobalService.UsersChatSockets.get(
      roomUpdate.new_kicked.value,
    );
    console.log('socket id to leave', userChatSocketsIds);
    userChatSocketsIds.forEach(async (socketId) => {
      const user_socket = GlobalService.Sockets.get(socketId);
      if (user_socket) {
        user_socket.leave(roomUpdate.room_id);
        await this.roomsService
          .deleteUser(Number(roomUpdate.room_id), roomUpdate.new_kicked.value)
          .then(() => {
            const targetUserSockets = GlobalService.UsersChatSockets.get(
              roomUpdate.new_kicked.value,
            );
            targetUserSockets.forEach((socket) => {
              this.server.to(socket).emit('A_CHANNELS_YOU_KICKED', {
                room_id: roomUpdate.room_id,
              });
            });
          });
      }
    });
  }
  @SubscribeMessage('ROOM_PASSWORD_UPDATE')
  async roomUpdatePassword(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string; new_password: string },
  ) {
    const room = await this.roomsService.findOne(Number(roomUpdate.room_id));
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
      const room = await this.roomsService.findOne(
        Number(createMessageDto.receiverId),
      );
      ////
      const targetUserOfRomm = room[0].ActiveUsers;
      let targetSockets;
      console.log('target users : ', targetUserOfRomm);
      targetUserOfRomm.forEach((user_is) => {
        targetSockets = GlobalService.UsersChatSockets.get(user_is);
        targetSockets.forEach((socket) => {
          this.server.to(socket).emit('NEW_MESSAGE', { ...createMessageDto });
        });
      });

      ///
    }
  }
  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    GlobalService.Sockets.set(client.id, client);
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