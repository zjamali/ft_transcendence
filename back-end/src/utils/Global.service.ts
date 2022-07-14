import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';


type JwtPayload = { id: string; username: string };

export class GlobalService {
  // static OnlineUsers: Map<string, string[]> = new Map();
  static AllOpnedSockets: string[] = [];
  static Users: any;
  
  static UsersEventsSockets : Map<string, string[]> = new Map();
  static UsersChatSockets:  Map<string, string[]> = new Map();


  constructor(
    private readonly jwtService: JwtService,
  ) {}
}
