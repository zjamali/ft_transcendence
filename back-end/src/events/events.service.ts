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
  ) {}


  async addUserSocket(user_id : string, socket_id: string) {
    this.AllOpnedSockets.push(socket_id);
    this.Users = await this.usersRepository.find();
    //get already opened sockets of user if exist
    const opened_sockets = this.OnlineUsers.get(user_id);
    if (opened_sockets)
      this.OnlineUsers.set(user_id, [...opened_sockets, socket_id]);
    else 
      this.OnlineUsers.set(user_id, [socket_id]);
    await this.setUserOnlineInDb(user_id);
    return {
      user: { ...this.Users.filter((user : User) => user.id === user_id) , isOnline: true },
      opnedSockets: [...this.AllOpnedSockets],
    };
  }

  async removeUserSocket(user_id : string,socket_id: string) {
    // remove socket from sockets array
    this.AllOpnedSockets = this.AllOpnedSockets.filter(
      (socket) => socket != socket_id,
    );
    // set user offline in database
    await this.setUserOfflineInDb(user_id);
    const offline_user = this.Users.filter((user) => user.id == user_id);
    if (this.OnlineUsers.get(user_id).length === 1) 
    {
      return { user: { ...offline_user }, sockets: this.AllOpnedSockets };
    }
    else 
    {
      this.OnlineUsers.set(user_id, this.OnlineUsers.get(user_id).filter((socket) => socket != socket_id));
      return { user: null, opnedSockets: [...this.AllOpnedSockets] };
    }
  }
  // update user status in DB
  async setUserOfflineInDb(user_id: string) {
    await this.usersRepository.update(user_id, { isOnline: false });
  }
  async setUserOnlineInDb(user_id: string) {
    await this.usersRepository.update(user_id, { isOnline: true });
  }
  
  public get AllopnedSockets() : string[] {
    return this.AllOpnedSockets;
  }
  
}
