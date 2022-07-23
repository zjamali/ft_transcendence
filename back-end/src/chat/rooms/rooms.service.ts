import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import Room from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutesMapper } from '@nestjs/core/middleware/routes-mapper';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    console.log('room :', createRoomDto);
    const newRoom = this.roomRepository.create(createRoomDto);
    return await this.roomRepository.save(newRoom);
  }

  async findAll(user_id: string) {
    const allRooms = await this.roomRepository.find();

    const filtredRooms = allRooms.filter((room) => {
      return !room.bannedUser?.includes(user_id);
    });
    return filtredRooms.sort((a, b) => Number(a.id) - Number(b.id));
  }

  findOne(id: number) {
    return this.roomRepository.find({ where: { id: id } });
  }

  async addUser(id: number, user_id: string) {
    const roomToUpdate = await this.roomRepository.findOne(id);
    if (roomToUpdate.ActiveUsers.includes(user_id)) {
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

  async muteUsers(room_id: string, muted_user: string[]) {
    console.log('mute user db ');
    const roomToUpdate = await this.roomRepository.findOne(room_id);
    roomToUpdate.mutedUsers = [...muted_user];
    this.roomRepository.save(roomToUpdate);
  }
  async unMuteUser(room_id: string, unmuted_user: string) {
    const roomToUpdate = await this.roomRepository.findOne(room_id);
    roomToUpdate.mutedUsers = roomToUpdate.mutedUsers.filter(
      (muted) => muted != unmuted_user,
    );
    this.roomRepository.save(roomToUpdate);
  }
}
