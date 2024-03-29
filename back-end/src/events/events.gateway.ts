import JwtTwoFactorGuard from 'src/auth/jwt-2fa-auth.guard';
import { GlobalService } from './../utils/Global.service';
import { UsersService } from 'src/users/users.service';
import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { UseGuards } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';

config({ path: '../.env' });

type JwtPayload = { id: string; username: string };

@WebSocketGateway({
  cors: {
    origin: `${process.env.FRONT_HOST}`,
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  Server: Server;

  allgetwaySockets: string[] = [];

  constructor(
    private readonly eventsService: EventsService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  @SubscribeMessage('LOG_OUT')
  async logOut(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    const targetUser = GlobalService.UsersEventsSockets.get(userId);
    targetUser?.forEach((socket) => {
      this.Server.to(socket).emit(
        'YOU_LOG_OUT',
        this.parseCookie(client.handshake.headers.cookie)['access_token'],
      );
    });
    // this.userService.logOut();
  }

  @UseGuards(JwtTwoFactorGuard)
  async handleConnection(client: Socket) {
    if (!client.handshake.headers.cookie) {
      client.disconnect();
      return;
    }
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    if (!user_id) {
      client.disconnect();
      return;
    }
    this.allgetwaySockets.push(client.id);
    const response = await this.eventsService.addUserEventsSocket(
      user_id,
      client.id,
    );
    if (response) {
      const { user, userSockets } = response;
      if (userSockets.length === 1) {
        this.Server.emit('A_USER_STATUS_UPDATED', { ...user });
        // client.broadcast.emit('A_USER_STATUS_UPDATED', { ...user});
        await this.eventsService.setUserOnlineInDb(user_id);
      }
    }
  }
  @UseGuards(JwtTwoFactorGuard)
  async handleDisconnect(client: Socket) {
    // const cookies = client.handshake.headers.cookie;

    if (!client.handshake.headers.cookie) return;
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    if (!user_id) return;
    this.allgetwaySockets = this.allgetwaySockets.filter(
      (socketid) => socketid != client.id,
    );
    const response = await this.eventsService.removeUserEventsSocket(
      user_id,
      client.id,
    );
    const { user, userSockets } = response;
    if (userSockets.length === 0) {
      // this.Server.emit('A_USER_STATUS_UPDATED', { ...user});
      client.broadcast.emit('A_USER_STATUS_UPDATED', { ...user });
      await this.eventsService.setUserOfflineInDb(user_id);
    }
  }

  @SubscribeMessage('send_game_invitaion_to_server')
  gameInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    gameInvitation: { sender: any; receiver: any; game_room: string },
  ) {
    const InviteduserSockets = GlobalService.UsersEventsSockets.get(
      gameInvitation.receiver.id,
    );
    InviteduserSockets?.forEach((invitedSocketId) => {
      this.Server.to(invitedSocketId).emit('GAME_INVITATION', {
        user: { ...gameInvitation.sender },
        senderSocket: client.id,
      });
    });
  }
  @SubscribeMessage('accept_game_invitaion_to_server')
  gameAcceptInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    gameInvitation: {
      sender: string;
      receiver: string;
      game_room: string;
      senderSocketId: string;
    },
  ) {
    const secondPlayerSockets = GlobalService.UsersEventsSockets.get(
      gameInvitation.receiver,
    );

    this.Server.to(gameInvitation.senderSocketId).emit(
      'game_invitation_accepted',
      {
        room_id: gameInvitation.game_room,
      },
    );
    this.Server.to(client.id).emit('game_invitation_accepted', {
      room_id: gameInvitation.game_room,
    });

    secondPlayerSockets?.forEach((socketsID) => {
      if (client.id !== socketsID)
        this.Server.to(socketsID).emit('TURN_OF_INVITATION_MODAL');
    });
  }

  @SubscribeMessage('GAME_START')
  async setPlayersStatusSTART(
    @ConnectedSocket() client: Socket,
    @MessageBody() playerId,
  ) {
    this.userService.setUserPlayingStatus(playerId, true);
    this.Server.emit('UPDATE_DATA');
  }
  @SubscribeMessage('GAME_OVER')
  async setPlayersStatusOVER(
    @ConnectedSocket() client: Socket,
    @MessageBody() playerId,
  ) {
    this.userService.setUserPlayingStatus(playerId, false);
    this.Server.emit('UPDATE_DATA');
  }

  @SubscribeMessage('I_UPDATE_MY_PROFILE')
  async profileUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    const user = await this.userService.findOne(userId);
    const userSockets = GlobalService.UsersEventsSockets.get(userId);
    userSockets?.forEach((socket) => {
      this.Server.to(socket).emit('A_PROFILE_UPDATE', { ...user });
    });
    client.broadcast.emit('A_USER_STATUS_UPDATED', { ...user });
    this.Server.emit('UPDATE_DATA');
    setTimeout(() => {
      this.Server.emit('UPDATE_DATA');
    }, 500);
  }
  @SubscribeMessage('I_UPDATE_MY_DATA')
  async userUpdateData(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    const user = await this.userService.findOne(userId);
    this.Server.to(client.id).emit('A_UPDATE_MY_DATA', { ...user });
    client.broadcast.emit('A_USER_STATUS_UPDATED', { ...user });
    client.broadcast.emit('UPDATE_DATA');
    setTimeout(() => {
      this.Server.emit('UPDATE_DATA');
    }, 500);
  }
  @SubscribeMessage('SEND_FRIEND_REQUEST')
  async sendFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() friendRequest: { sender: string; target: string },
  ) {
    const targetSockets = GlobalService.UsersEventsSockets.get(
      friendRequest.target,
    );
    targetSockets?.forEach((socketsID) => {
      this.Server.to(socketsID).emit('NEW_FRIEND_REQUEST');
    });
    const senderSockets = GlobalService.UsersEventsSockets.get(
      friendRequest.sender,
    );
    senderSockets?.forEach((socketsID) => {
      this.Server.to(socketsID).emit('NEW_PENDING_REQUEST');
    });
    setTimeout(() => {
      this.Server.emit('UPDATE_DATA');
    }, 500);
  }
  @SubscribeMessage('ACCEPT_FREIND_REQUEST')
  async acceptFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() friendRequest: { accpter: string; relatedUserId: string },
  ) {
    const targetSockets = GlobalService.UsersEventsSockets.get(
      friendRequest.accpter,
    );
    targetSockets?.forEach((socketsID) => {
      this.Server.to(socketsID).emit('UPDATE_DATA');
    });

    const senderSockets = GlobalService.UsersEventsSockets.get(
      friendRequest.relatedUserId,
    );
    senderSockets?.forEach((socketsID) => {
      this.Server.to(socketsID).emit('UPDATE_DATA');
    });
    setTimeout(() => {
      this.Server.emit('UPDATE_DATA');
    }, 500);
  }
  @SubscribeMessage('DENY_FREIND_REQUEST')
  async denyFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() friendRequest: { denier: string; relatedUserId: string },
  ) {
    this.Server.emit('UPDATE_DATA');
    setTimeout(() => {
      this.Server.emit('UPDATE_DATA');
    }, 500);
  }
  @SubscribeMessage('BLOCK_A_USER')
  async blockUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() blockUser: { blocker: string; target: string },
  ) {
    this.Server.emit('UPDATE_DATA');

    setTimeout(() => {
      this.Server.emit('UPDATE_DATA');
    }, 500);
  }
  @SubscribeMessage('UNBLOCK_A_USER')
  async unblockUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() blockUser: { unblocker: string; target: string },
  ) {
    this.Server.emit('UPDATE_DATA');
    setTimeout(() => {
      this.Server.emit('UPDATE_DATA');
    }, 500);
  }

  getUserIdFromJWT(cookies: string): string {
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
}
