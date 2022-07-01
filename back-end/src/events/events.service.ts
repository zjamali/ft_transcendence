import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';

@Injectable()
export class EventsService {
  OnlineUsers: Map<string, string[]> = new Map();

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  async addUserSocket(user : User ,socket_id: string) {
    const opned_sockets = this.OnlineUsers.get(user.id);
    if (opned_sockets)
      this.OnlineUsers.set(user.id, [...opned_sockets, socket_id]);
    else this.OnlineUsers.set(user.id, [socket_id]);

    await this.usersRepository.update(user.id, { isOnline: true });
    if ( this.OnlineUsers.get(user.id).length === 1)
    {
      // get sockets of user friends
      // HERE WE SEND EMIT TO ALL USERS 
      let allusersockets: string[] = [];
      for (const [key , value] of this.OnlineUsers) {
        allusersockets.push(...this.OnlineUsers.get(key));
      }
      return {user:{...user, isOnline: true} , sockets : [...allusersockets]}
    }
  }

  async removeUserSocket(socket_id: string) {
    let user_id: string;
    console.log('remove socket ', socket_id);
    for (const [key, value] of this.OnlineUsers.entries()) {
      console.log(key + ' = ' + value);
      if (value.includes(socket_id)) {
        user_id = key;
        console.log('user to remove his socket', user_id);
        if (this.OnlineUsers.get(user_id).length === 1) {
          // set user offline;
          console.log('set user as offline : ', user_id);
          this.OnlineUsers.delete(user_id);
          console.log(
            'user to set offline : ',
            await this.usersRepository.findOne(user_id),
          );
          await this.usersRepository.update(user_id, { isOnline: false });
          return await this.usersRepository.findOne(user_id);
        } else {
          // just remove socket specified
          this.OnlineUsers.set(
            user_id,
            this.OnlineUsers.get(user_id).filter((socket) => {
              return socket != socket_id;
            }),
          );
          return null;
        }
      }
    }
  }
}
