import * as bcrypt from 'bcrypt';
export class GlobalService {
  static AllOpnedSockets: string[] = [];
  static Users: any;

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
