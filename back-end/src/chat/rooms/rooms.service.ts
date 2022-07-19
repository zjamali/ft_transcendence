import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
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
    return (
      //await this.roomRepository
      //  .createQueryBuilder('room')
      //  .where('room.ActiveUsers like :id', { id: '%' + user_id + '%' })
      //  .orWhere('room.roomType like :roomtype', { roomtype: '%Public%' })
      //  .getMany()
      (await this.roomRepository.find()).sort(
        (a, b) => Number(a.id) - Number(b.id),
      )
    );
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
    const roomToUpdate = await this.roomRepository.findOne(id);
    roomToUpdate.ActiveUsers = roomToUpdate.ActiveUsers.filter(
      (ActiveUserid) => {
        return ActiveUserid !== user_id;
      },
    );
    await this.roomRepository.save(roomToUpdate);
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
