import * as bcrypt from 'bcrypt';
import { Socket } from 'socket.io';
export class GlobalService {
  static AllOpnedSockets: string[] = [];
  static Users: any;

  static blockedAndBlockerUser: string[] = [];
  static UserBlockedMap: Map<string, string[]> = new Map();

  static Sockets: Map<string, Socket> = new Map(); // socket with id : socket

  static UsersEventsSockets: Map<string, string[]> = new Map();
  static UsersChatSockets: Map<string, string[]> = new Map();

  static async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  static async CheckPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
