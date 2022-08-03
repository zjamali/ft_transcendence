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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

type JwtPayload = { id: string; username: string };

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
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
  async logOut(client: any) {
    console.log('hello log out');
    // this.userService.logOut();
  }

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: any) {
    this.allgetwaySockets.push(client.id);
    if (!client.handshake.headers.cookie) return;
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    const response = await this.eventsService.addUserEventsSocket(
      user_id,
      client.id,
    );
    if (response) {
      const { user, userSockets } = response;
      if (userSockets.length === 1) {
        console.log('✅ user : connected : ', response);
        this.Server.emit('A_USER_STATUS_UPDATED', { ...user });
        // client.broadcast.emit('A_USER_STATUS_UPDATED', { ...user});
        await this.eventsService.setUserOnlineInDb(user_id);
      }
    }
    console.log('getway sockets :', this.allgetwaySockets);
  }
  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: any) {
    // const cookies = client.handshake.headers.cookie;
    const user_id = this.getUserIdFromJWT(client.handshake.headers.cookie);
    this.allgetwaySockets = this.allgetwaySockets.filter(
      (socketid) => socketid != client.id,
    );
    const response = await this.eventsService.removeUserEventsSocket(
      user_id,
      client.id,
    );
    const { user, userSockets } = response;
    if (userSockets.length === 0) {
      console.log('user: disconnect ❌', response);
      // this.Server.emit('A_USER_STATUS_UPDATED', { ...user});
      client.broadcast.emit('A_USER_STATUS_UPDATED', { ...user });
      await this.eventsService.setUserOfflineInDb(user_id);
    }
  }

  @SubscribeMessage('send_game_invitaion_to_server')
  gameInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    gameInvitation: { sender: any; receiver: string; game_room: string },
  ) {
    console.log(
      '%%%%%%%%%',
      gameInvitation.sender,
      ' :game invitaion sent to ',
      gameInvitation.receiver,
      ' to palay in room : ',
      gameInvitation.game_room,
    );
    const InviteduserSockets = GlobalService.UsersEventsSockets.get(
      gameInvitation.receiver,
    );
    // if (Inviteduser) {
    //   console.log('invited user is :', Inviteduser);
    // }
    InviteduserSockets.forEach((invitedSocketId) => {
      this.Server.to(invitedSocketId).emit('GAME_INVITATION', {
        hello: 'hello',
      });
    });
    console.log('InviteduserSockets : ', InviteduserSockets);
  }
  @SubscribeMessage('accept_game_invitaion_to_server')
  gameAcceptInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    gameInvitation: { sender: string; receiver: string; game_room: string },
  ) {
    console.log(
      '+++++++++',
      gameInvitation.sender,
      ' :game accept invitaion of ',
      gameInvitation.receiver,
      ' to palay in room : ',
      gameInvitation.game_room,
    );
    const firstPlayersSockets = GlobalService.UsersEventsSockets.get(
      gameInvitation.receiver,
    );
    const secondPlayerSockets = GlobalService.UsersEventsSockets.get(
      gameInvitation.sender,
    );

    firstPlayersSockets?.forEach((socketsID) => {
      this.Server.to(socketsID).emit('STAR_PLAYING', {
        hello: 'hello',
      });
    });
    setTimeout(() => {
      secondPlayerSockets?.forEach((socketsID) => {
        this.Server.to(socketsID).emit('STAR_PLAYING', {
          hello: 'hello',
        });
      });
    }, 200);
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
