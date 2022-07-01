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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  Server: Server;

  constructor(private readonly eventsService: EventsService) {}

  @SubscribeMessage('IAM ONLINE')
  async setUserOnline(client: Socket, payload: any) {
   
    await this.eventsService.addUserSocket(payload, client.id).then((response) => {
      if (response) {
        const {user , sockets} = response;
        /// emit a user his status updated
        this.Server.emit('A_USER_STATUS_UPDATED', {...user});
      }
    });
  }

  async handleConnection(client: any) {
    console.log('connect ', client.id);
  }

  async handleDisconnect(client: any) {
    await this.eventsService.removeUserSocket(client.id).then((user) => {
      if (user) {
        this.Server.emit('A_USER_STATUS_UPDATED', { ...user });
      }
    });
  }
}
