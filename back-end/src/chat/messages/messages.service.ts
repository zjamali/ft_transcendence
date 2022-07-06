import  Message from './entities/message.entity'
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly messagesRepository: Repository<Message>,
  ) {}
  create(createMessageDto: CreateMessageDto) {
    console.log("message : ", createMessageDto);
    const newMessage = this.messagesRepository.create(createMessageDto);
    this.messagesRepository.save(newMessage);
    return 'This action adds a new message';
  }

  async findAll() {
    return await this.messagesRepository.find();
  }

  async findOne(id: string) {
    return await this.messagesRepository.find({ roomId: id })
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
