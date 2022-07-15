import { Repository } from 'typeorm';
import { Injectable, Param } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import Room from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  async findAll() {
    return this.roomRepository.find({ where: { roomType: 'Public' } });
  }

  findOne(id: number) {
    return this.roomRepository.find({ where: { id: id } });
  }

  async addUser(id: number, user_id: string) {
    const roomToUpdate = await this.roomRepository.findOne(id);
    if (roomToUpdate.ActiveUsers.includes(user_id)) {
      return false;
    }
    roomToUpdate.ActiveUsers = [...roomToUpdate.ActiveUsers, user_id];
    await this.roomRepository.save(roomToUpdate);
    return true;
  }
  deleteUser(id: number, user_id: string) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
