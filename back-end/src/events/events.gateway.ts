import { Server } from 'socket.io';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
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
  ) {}

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: any) {
    this.allgetwaySockets.push(client.id);
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
