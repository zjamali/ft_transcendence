import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import Room from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalService } from 'src/utils/Global.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly userService: UsersService,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const newRoom = this.roomRepository.create(createRoomDto);
    return await this.roomRepository.save(newRoom);
  }

  async findAll(user_id: string) {
    const allRooms = await this.roomRepository.find();

    const usersBlockedBy = await this.userService.getBlockedByUsers(user_id);
    const usersBlocked = await this.userService.getBolckedUsers(user_id);

    const forbiddenUsers = [...usersBlockedBy, ...usersBlocked];
    const forbiddenUsersIds = forbiddenUsers.map((user) => user.id);
    const filtredRooms = allRooms.filter((room) => {
      return !room.bannedUser?.includes(user_id);
    });
    const roomUserHaveAccess = filtredRooms.filter((room) => {
      return !forbiddenUsersIds?.includes(room.owner);
    });
    return roomUserHaveAccess.sort((a, b) => Number(a.id) - Number(b.id));
  }

  findOne(id: string) {
    return this.roomRepository.find({ where: { id: id } });
  }

  async addUser(id: string, user_id: string) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: id },
    });
    if (roomToUpdate.ActiveUsers?.includes(user_id)) {
      return;
    }
    roomToUpdate.ActiveUsers = [...roomToUpdate.ActiveUsers, user_id];
    await this.roomRepository.save(roomToUpdate);
    return;
  }
  async deleteUser(id: string, user_id: string) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: id },
    });
    roomToUpdate.ActiveUsers = roomToUpdate.ActiveUsers.filter(
      (ActiveUserid) => {
        return ActiveUserid !== user_id;
      },
    );
    if (user_id === roomToUpdate.owner) {
      // set a first  admin a owner
      if (roomToUpdate.admins[1]) {
        roomToUpdate.owner = roomToUpdate.admins[1];
      } else {
        if (roomToUpdate.ActiveUsers[1]) {
          roomToUpdate.owner = roomToUpdate.ActiveUsers[1];
        } else {
          if (roomToUpdate.ActiveUsers[0])
            roomToUpdate.owner = roomToUpdate.ActiveUsers[0];
        }
      }
    }
    roomToUpdate.admins = roomToUpdate.admins.filter((admins) => {
      return admins !== user_id;
    });
    await this.roomRepository.save(roomToUpdate);
  }

  async bannedUser(id: string, bannedUSerIds: string[]) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: id },
    });
    // roomToUpdate.bannedUser = [];
    // this.roomRepository.save(roomToUpdate);
    bannedUSerIds.forEach((bannedId) => {
      roomToUpdate.ActiveUsers = roomToUpdate.ActiveUsers.filter(
        (user) => user !== bannedId,
      );
    });
    if (bannedUSerIds.length) roomToUpdate.bannedUser = [...bannedUSerIds];
    else roomToUpdate.bannedUser = null;
    this.roomRepository.save(roomToUpdate);
  }
  async removePassword(room_id: string) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    roomToUpdate.isProtected = false;
    roomToUpdate.password = null;
    roomToUpdate.roomType = 'Public';
    roomToUpdate.image = '/images/icons/channel_icon.png';
    this.roomRepository.save(roomToUpdate);
  }
  async updatePassword(room_id: string, new_password: string) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    roomToUpdate.password = await GlobalService.hashPassword(new_password);
    this.roomRepository.save(roomToUpdate);
  }
  async addPassword(room_id: string, password: string) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    roomToUpdate.password = await GlobalService.hashPassword(password);
    roomToUpdate.roomType = 'Private';
    roomToUpdate.image = '/images/icons/channel_private.png';
    roomToUpdate.isProtected = true;
    this.roomRepository.save(roomToUpdate);
  }

  async muteUsers(room_id: string, muted_user: string[]) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    roomToUpdate.mutedUsers = [...muted_user];
    return await this.roomRepository.save(roomToUpdate);
  }
  async unMuteUser(room_id: string, unmuted_user: string) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    roomToUpdate.mutedUsers = roomToUpdate.mutedUsers.filter(
      (muted) => muted != unmuted_user,
    );
    this.roomRepository.save(roomToUpdate);
  }

  async setAdmins(room_id: string, admins: string[]) {
    const roomToUpdate = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    if (!admins.includes(roomToUpdate.owner))
      roomToUpdate.admins = [roomToUpdate.owner, ...admins];
    else roomToUpdate.admins = [...admins];
    this.roomRepository.save(roomToUpdate);
  }

  async deleteRoom(room_id: string) {
    const roomToDelete = await this.roomRepository.find({
      where: {
        id: room_id,
      },
    });
    await this.roomRepository.remove(roomToDelete);
  }
}
