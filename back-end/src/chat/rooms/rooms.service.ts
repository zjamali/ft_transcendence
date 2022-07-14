import { Repository } from 'typeorm';
import { Injectable, Param } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
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
    await this.roomRepository.save(newRoom);
    return 'This action adds a new room';
  }

  async findAll() {
    return this.roomRepository.find({ where: { roomType: 'Public' } });
  }

  findOne(id: number) {
    return this.roomRepository.find({ where: { id: id } });
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
