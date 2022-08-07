import { Injectable } from '@nestjs/common';
import { GlobalService } from 'src/utils/Global.service';

@Injectable()
export class ChatService {
  // create(createChatDto: any) {
  //   return 'This action adds a new chat';
  // }

  async addUserChatSocket(user_id: string, socket_id: string) {
    GlobalService.AllOpnedSockets.push(socket_id);
    //get already opened sockets of user if exist
    const opened_sockets = GlobalService.UsersChatSockets.get(user_id);
    if (opened_sockets)
      GlobalService.UsersChatSockets.set(user_id, [
        ...opened_sockets,
        socket_id,
      ]);
    else GlobalService.UsersChatSockets.set(user_id, [socket_id]);
  }

  async removeUserChatSocket(user_id: string, socket_id: string) {
    // remove socket from sockets array
    GlobalService.AllOpnedSockets = GlobalService.AllOpnedSockets.filter(
      (socket) => socket != socket_id,
    );

    // const user = GlobalService.Users.filter((user: User) => user.id == user_id);
    GlobalService.UsersChatSockets.set(
      user_id,
      GlobalService.UsersChatSockets.get(user_id)?.filter(
        (socket) => socket != socket_id,
      ),
    );
  }

  async getUserChatSockets(user_id: string) {
    return [...GlobalService.UsersChatSockets.get(user_id)];
  }
}
