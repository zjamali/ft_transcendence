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
    console.log('room :', createRoomDto);
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

  findOne(id: number) {
    return this.roomRepository.find({ where: { id: id } });
  }

  async addUser(id: number, user_id: string) {
    const roomToUpdate = await this.roomRepository.findOne(id);
    if (roomToUpdate.ActiveUsers?.includes(user_id)) {
      return;
    }
    roomToUpdate.ActiveUsers = [...roomToUpdate.ActiveUsers, user_id];
    await this.roomRepository.save(roomToUpdate);
    return;
  }
  async deleteUser(id: number, user_id: string) {
    console.log('remove a user ', user_id);
    const roomToUpdate = await this.roomRepository.findOne(id);
    roomToUpdate.ActiveUsers = roomToUpdate.ActiveUsers.filter(
      (ActiveUserid) => {
        return ActiveUserid !== user_id;
      },
    );
    if (user_id === roomToUpdate.owner) {
      // set a first  admin a owner
      if (roomToUpdate.admins[1]) {
        console.log('set new admins');
        roomToUpdate.owner = roomToUpdate.admins[1];
      }
    }
    roomToUpdate.admins = roomToUpdate.admins.filter((admins) => {
      return admins !== user_id;
    });
    await this.roomRepository.save(roomToUpdate);
  }

  async bannedUser(id: number, bannedUSerIds: string[]) {
    const roomToUpdate = await this.roomRepository.findOne(id);
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
    const roomToUpdate = await this.roomRepository.findOne(room_id);
    roomToUpdate.isProtected = false;
    roomToUpdate.password = null;
    roomToUpdate.roomType = 'Public';
    roomToUpdate.image = '/images/icons/channel_icon.png';
    this.roomRepository.save(roomToUpdate);
  }
  async updatePassword(room_id: string, new_password: string) {
    const roomToUpdate = await this.roomRepository.findOne(room_id);
    roomToUpdate.password = await GlobalService.hashPassword(new_password);
    this.roomRepository.save(roomToUpdate);
  }
  async addPassword(room_id: string, password: string) {
    const roomToUpdate = await this.roomRepository.findOne(room_id);
    roomToUpdate.password = await GlobalService.hashPassword(password);
    roomToUpdate.roomType = 'Private';
    roomToUpdate.image = '/images/icons/channel_private.png';
    roomToUpdate.isProtected = true;
    this.roomRepository.save(roomToUpdate);
  }

  async muteUsers(room_id: string, muted_user: string[]) {
    console.log('mute user db ');
    const roomToUpdate = await this.roomRepository.findOne(room_id);
    roomToUpdate.mutedUsers = [...muted_user];
    return await this.roomRepository.save(roomToUpdate);
  }
  async unMuteUser(room_id: string, unmuted_user: string) {
    const roomToUpdate = await this.roomRepository.findOne(room_id);
    roomToUpdate.mutedUsers = roomToUpdate.mutedUsers.filter(
      (muted) => muted != unmuted_user,
    );
    this.roomRepository.save(roomToUpdate);
  }

  async setAdmins(room_id: string, admins: string[]) {
    const roomToUpdate = await this.roomRepository.findOne(room_id);
    if (!admins.includes(roomToUpdate.owner))
      roomToUpdate.admins = [roomToUpdate.owner, ...admins];
    else roomToUpdate.admins = [...admins];
    this.roomRepository.save(roomToUpdate);
  }
}
