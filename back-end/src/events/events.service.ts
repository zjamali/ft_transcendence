import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalService } from 'src/utils/Global.service';
import User from 'src/users/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    async () => {
      GlobalService.Users = await this.usersRepository.find();
    };
  }

  async addUserEventsSocket(user_id: string, socket_id: string) {
    GlobalService.AllOpnedSockets.push(socket_id);
    GlobalService.Users = await this.usersRepository.find();
    //get already opened sockets of user if exist
    const opened_sockets = GlobalService.UsersEventsSockets.get(user_id);
    if (opened_sockets)
      GlobalService.UsersEventsSockets.set(user_id, [
        ...opened_sockets,
        socket_id,
      ]);
    else GlobalService.UsersEventsSockets.set(user_id, [socket_id]);
    return {
      user: {
        ...GlobalService.Users.filter((user: User) => user.id === user_id),
        isOnline: true,
      },
      userSockets: [...GlobalService.UsersEventsSockets.get(user_id)],
    };
  }

  async removeUserEventsSocket(user_id: string, socket_id: string) {
    // remove socket from sockets array
    GlobalService.AllOpnedSockets = GlobalService.AllOpnedSockets.filter(
      (socket) => socket != socket_id,
    );
    const user = GlobalService.Users.filter((user: User) => user.id == user_id);
    GlobalService.UsersEventsSockets.set(
      user_id,
      GlobalService.UsersEventsSockets.get(user_id).filter(
        (socket) => socket != socket_id,
      ),
    );
    return {
      user: { ...user, isOnline: false },
      userSockets: GlobalService.UsersEventsSockets.get(user_id),
    };
  }

  // update user status in DB
  async setUserOfflineInDb(user_id: string) {
    if (user_id)
      await this.usersRepository.update(user_id, { isOnline: false });
  }
  async setUserOnlineInDb(user_id: string) {
    if (user_id) await this.usersRepository.update(user_id, { isOnline: true });
  }
}
