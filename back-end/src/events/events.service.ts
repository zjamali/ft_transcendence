import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';

@Injectable()
export class EventsService {
  OnlineUsers: Map<string, string[]> = new Map();
  AllOpnedSockets: string[] = [];
  Users: any;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    async () => {
      this.Users = await this.usersRepository.find();
    };
  }

  async addUserSocket(user_id: string, socket_id: string) {
    this.AllOpnedSockets.push(socket_id);
    this.Users = await this.usersRepository.find();
    //get already opened sockets of user if exist
    const opened_sockets = this.OnlineUsers.get(user_id);

    if (opened_sockets)
      this.OnlineUsers.set(user_id, [...opened_sockets, socket_id]);
    else this.OnlineUsers.set(user_id, [socket_id]);
    return {
      user: {
        ...this.Users.filter((user: User) => user.id === user_id),
        isOnline: true,
      },
      userSockets: [...this.OnlineUsers.get(user_id)],
    };
  }

  async removeUserSocket(user_id: string, socket_id: string) {
    // remove socket from sockets array
    this.AllOpnedSockets = this.AllOpnedSockets.filter(
      (socket) => socket != socket_id,
    );
    const user = this.Users.filter((user: User) => user.id == user_id);
    this.OnlineUsers.set(user_id, this.OnlineUsers.get(user_id).filter((socket) => socket != socket_id));
    return {
      user: { ...user, isOnline: false },
      userSockets: this.OnlineUsers.get(user_id),
    };
  }

  // update user status in DB
  async setUserOfflineInDb(user_id: string) {
    await this.usersRepository.update(user_id, { isOnline: false });
  }
  async setUserOnlineInDb(user_id: string) {
    await this.usersRepository.update(user_id, { isOnline: true });
  }

  public get AllopnedSockets(): string[] {
    return this.AllOpnedSockets;
  }
}
