import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
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
  // origin : 'http://localhost:3000'
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
    const cookies = client.handshake.headers.cookie;
    const response = await this.eventsService.addUserSocket(this.getUserIdFromJWT(cookies), client.id);
    if (response) {
      console.log('✅ user : connected : ', response);
      const { user, opnedSockets } = response;
      this.Server.emit('A_USER_STATUS_UPDATED', { ...user, isOnline: true });
    }
  }
  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: any) {
    const cookies = client.handshake.headers.cookie;
    this.allgetwaySockets = this.allgetwaySockets.filter((socketid) => socketid != client.id);
    const response = await this.eventsService.removeUserSocket(this.getUserIdFromJWT(cookies), client.id);
    if (response.user) {
      console.log('❌ user disconnect : ', response);
      const { user, opnedSockets } = response;
      this.Server.emit('A_USER_STATUS_UPDATED', { ...user, isOnline: false });
    }
    console.log('getway sockets :', this.allgetwaySockets);
  }

  getUserIdFromJWT(cookies: string): string {
    const decodedJwtAccessToken: any = this.jwtService.decode(
      cookies.replace('access_token=', ''),
    );
    const jwtPayload: JwtPayload = { ...decodedJwtAccessToken };
    return jwtPayload.id;
  }
}
