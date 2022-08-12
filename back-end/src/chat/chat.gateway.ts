import { UsersService } from 'src/users/users.service';
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

import { config } from 'dotenv';

config({ path: '../.env' });

export type JwtPayload = { id: string; username: string };

@WebSocketGateway({
  cors: {
    origin: `${process.env.FRONT_HOST}`,
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
    private schedulerRegistry: SchedulerRegistry,
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
    private readonly userService: UsersService,
  ) {}

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
    const roomToJoin = await this.roomsService.findOne(data.room_id);
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
    const roomToJoin = await this.roomsService.findOne(newUserToJoin.room_id);
    console.log('join room: ', roomToJoin);
    client.join(newUserToJoin.room_id);

    console.log(
      'someOne is joined : id ',
      newUserToJoin.user_id,
      ' this room : ',
      roomToJoin,
    );
    this.roomsService
      .addUser(newUserToJoin.room_id, newUserToJoin.user_id)
      .then(() => {
        const targetUserSockets = GlobalService.UsersChatSockets.get(
          newUserToJoin.user_id,
        );
        targetUserSockets?.forEach((socket) => {
          this.server.to(socket).emit('A_CHANNELS_STATUS_UPDATED');
        });
      });
  }
  //// manage a channel
  @SubscribeMessage('ROOM_ADMINS_STATUS')
  async roomAdmins(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string; new_admins: any[] },
  ) {
    const admins = roomUpdate.new_admins.map((admin) => {
      return admin?.value;
    });
    const room = await this.roomsService.findOne(roomUpdate.room_id);
    if (room[0].admins.includes(roomUpdate.admin_id)) {
      await this.roomsService
        .setAdmins(roomUpdate.room_id, [...admins])
        .then(async () => {
          const room = await this.roomsService.findOne(roomUpdate.room_id);
          room[0].ActiveUsers.forEach((activeUser) => {
            const userSockets = GlobalService.UsersChatSockets.get(activeUser);
            userSockets.forEach((socketId) => {
              this.server.to(socketId).emit('ADMINS_STATUS_UPDATED');
            });
          });
        });
    }
  }
  @SubscribeMessage('ROOM_REMOVE_PASSWORD')
  async removePassword(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string },
  ) {
    const room = await this.roomsService.findOne(roomUpdate.room_id);
    if (room[0].owner === roomUpdate.admin_id) {
      await this.roomsService.removePassword(roomUpdate.room_id);
      setTimeout(() => {
        this.server.emit('A_CHANNELS_STATUS_UPDATED');
      }, 100);
    }
  }
  @SubscribeMessage('ROOM_ADD_PASSWORD')
  async addPassword(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string; password: string },
  ) {
    const room = await this.roomsService.findOne(roomUpdate.room_id);
    if (room[0].owner === roomUpdate.admin_id) {
      await this.roomsService.addPassword(
        roomUpdate.room_id,
        roomUpdate.password,
      );
      setTimeout(() => {
        this.server.emit('A_CHANNELS_STATUS_UPDATED');
      }, 100);
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
    const room = await this.roomsService.findOne(roomUpdate.room_id);
    if (!room[0].admins.includes(roomUpdate.admin_id)) return;

    const mutedUser = roomUpdate.muted_user.map((user) => {
      return user.value;
    });
    const alreadyMutedUser = room[0].mutedUsers;

    ////////////

    if (!alreadyMutedUser || mutedUser?.length > alreadyMutedUser.length) {
      const newMutedUSers = mutedUser.filter(
        (user) => !alreadyMutedUser?.includes(user),
      );
      if (roomUpdate.timeToMute > 0)
        await this.roomsService.muteUsers(roomUpdate.room_id, mutedUser);
      console.log('new muted users :', newMutedUSers);
      newMutedUSers.forEach((newMutedUSer) => {
        if (roomUpdate.timeToMute > 0) {
          this.muteAUserForWhile(
            `${newMutedUSer}`,
            roomUpdate.room_id,
            roomUpdate.timeToMute,
          );
          const userSocketsIds =
            GlobalService.UsersChatSockets.get(newMutedUSer);
          userSocketsIds.forEach((socketId) => {
            this.server.to(socketId).emit('YOU_GET_MUTED');
          });
        }
      });
    } else {
      const unMutedUSers = alreadyMutedUser.filter(
        (user) => !mutedUser.includes(user),
      );
      console.log('new unmuted users :', unMutedUSers);
      unMutedUSers.forEach((newUnMutedUSer) => {
        this.deleteUnmuteUserTime(`${newUnMutedUSer}`, roomUpdate.room_id);
      });
    }

    ////////
  }

  muteAUserForWhile(jobName: string, room_id: string, time: number) {
    const job = new CronJob(`*/${time} * * * *`, () => {
      console.log('cron job mute a user');
      this.deleteUnmuteUserTime(jobName, room_id);
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
    console.log(
      `********** Job for every seconds user : ${jobName} , room  :${room_id} , for ${time} minutes`,
    );
  }
  deleteUnmuteUserTime(jobName: string, room_id: string) {
    if (!this.schedulerRegistry.doesExist('cron', jobName)) return;
    this.schedulerRegistry.deleteCronJob(jobName);
    console.log(
      `********** delete  Job for every seconds ${jobName} : ${room_id}`,
    );
    this.roomsService.unMuteUser(room_id, jobName).then(() => {
      const userSocketsIds = GlobalService.UsersChatSockets.get(jobName);
      userSocketsIds.forEach((socketId) => {
        this.server.to(socketId).emit('YOU_GET_UNMUTED');
        setTimeout(() => {
          this.server.to(socketId).emit('YOU_GET_UNMUTED');
        }, 100);
      });
    });
  }

  @SubscribeMessage('ROOM_BAN_A_USER')
  async roomBannedUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string; banned: any[] },
  ) {
    const room = await this.roomsService.findOne(roomUpdate.room_id);
    // check if request owner is admin
    if (!room[0].admins.includes(roomUpdate.admin_id)) return;

    const bannedUserIds = roomUpdate.banned.map((user) => {
      return user.value;
    });
    if (bannedUserIds.includes(room[0].owner)) return;
    /// if admin is not owner and wanna ban a other admin
    if (room[0].owner !== roomUpdate.admin_id) {
      room[0].admins.forEach((admin) => {
        if (bannedUserIds.includes(admin)) return;
      });
    }

    await this.roomsService.bannedUser(roomUpdate.room_id, bannedUserIds);
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
    const room = await this.roomsService.findOne(roomUpdate.room_id);
    if (room[0].owner === roomUpdate.new_kicked.value) return;
    const userChatSocketsIds = GlobalService.UsersChatSockets.get(
      roomUpdate.new_kicked.value,
    );
    console.log('socket id to leave', userChatSocketsIds);
    userChatSocketsIds.forEach(async (socketId) => {
      const user_socket = GlobalService.Sockets.get(socketId);
      if (user_socket) {
        user_socket.leave(roomUpdate.room_id);
        await this.roomsService
          .deleteUser(roomUpdate.room_id, roomUpdate.new_kicked.value)
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
  @SubscribeMessage('ROOM_UPDATE_PASSWORD')
  async roomUpdatePassword(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    roomUpdate: { admin_id: string; room_id: string; new_password: string },
  ) {
    const room = await this.roomsService.findOne(roomUpdate.room_id);
    if (room[0].owner === roomUpdate.admin_id) {
      await this.roomsService.updatePassword(
        roomUpdate.room_id,
        roomUpdate.new_password,
      );
      setTimeout(() => {
        this.server.emit('A_CHANNELS_STATUS_UPDATED');
      }, 100);
    }
  }

  @SubscribeMessage('DELETE_ROOM')
  async deleteChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() deleteChannel: { admin_id: string; room_id: string },
  ) {
    const room = await this.roomsService.findOne(deleteChannel.room_id);
    if (room[0].owner === deleteChannel.admin_id) {
      // this.server.sockets
      //   .in(deleteChannel.room_id)
      //   .socketsLeave(deleteChannel.room_id);
      const userSockets = await this.server
        .in(deleteChannel.room_id)
        .fetchSockets();
      userSockets.forEach((user) => {
        user.leave(deleteChannel.room_id);
      });
      await this.messagesService.deleteRoomMessages(deleteChannel.room_id);
      await this.roomsService.deleteRoom(deleteChannel.room_id);

      setTimeout(() => {
        this.server.emit('A_CHANNELS_STATUS_UPDATED');
      }, 200);
    }
  }

  @SubscribeMessage('LEAVE_ROOM')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() UserToLeaveRoom: { user_id: string; room_id: string },
  ) {
    const roomToLeave = await this.roomsService.findOne(
      UserToLeaveRoom.room_id,
    );
    console.log('leave room ', roomToLeave);
    client.leave(UserToLeaveRoom.room_id);
    this.roomsService
      .deleteUser(UserToLeaveRoom.room_id, UserToLeaveRoom.user_id)
      .then(async () => {
        const newRoomData = await this.roomsService.findOne(
          UserToLeaveRoom.room_id,
        );
        if (newRoomData[0].owner !== roomToLeave[0].owner) {
          this.server
            .to(UserToLeaveRoom.room_id)
            .emit('A_CHANNELS_STATUS_UPDATED');
        } else {
          const targetUserSockets = GlobalService.UsersChatSockets.get(
            UserToLeaveRoom.user_id,
          );
          targetUserSockets.forEach((socket) => {
            this.server.to(socket).emit('A_CHANNELS_STATUS_UPDATED');
          });
        }
      });
  }

  @SubscribeMessage('SEND_MESSAGE')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    if (!client.handshake.headers.cookie) return;
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    console.log('message : ', createMessageDto, ' user id : ', user_id);
    if (!user_id) return;
    if (user_id !== createMessageDto.senderId) return;

    if (createMessageDto.content.length > 100) return;
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
      const room = await this.roomsService.findOne(createMessageDto.receiverId);
      // if sender is muted do nothings
      if (room[0].mutedUsers?.includes(createMessageDto.senderId)) return;
      ////
      const usersBlockedBy = await this.userService.getBlockedByUsers(
        createMessageDto.senderId,
      );
      const usersBlocked = await this.userService.getBolckedUsers(
        createMessageDto.senderId,
      );
      const forbiddenUserToSendMessage = [...usersBlockedBy, ...usersBlocked];
      const forbiddenIds = forbiddenUserToSendMessage.map((user) => {
        return user.id;
      });
      console.log('forbidded ids ', forbiddenIds);
      const targetUserOfRomm = room[0].ActiveUsers.filter(
        (ActiveUser) => !forbiddenIds.includes(ActiveUser),
      );
      ///
      let targetSockets;
      console.log('target users : ', targetUserOfRomm);
      targetUserOfRomm?.forEach((user_is) => {
        targetSockets = GlobalService.UsersChatSockets.get(user_is);
        targetSockets?.forEach((socket) => {
          this.server.to(socket).emit('NEW_MESSAGE', { ...createMessageDto });
        });
      });

      ///
    }
  }
  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    if (!client.handshake.headers.cookie) return;
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    GlobalService.Sockets.set(client.id, client);
    this.chatService.addUserChatSocket(user_id, client.id);
  }

  async handleDisconnect(client: Socket) {
    if (!client.handshake.headers.cookie) return;
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
    if (cookies) {
      cookies = cookies.split('; ');
      const result = {};
      for (const i in cookies) {
        const cur = cookies[i].split('=');
        result[cur[0]] = cur[1];
      }
      return result;
    }
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
