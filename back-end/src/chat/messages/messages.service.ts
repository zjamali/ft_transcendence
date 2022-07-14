import Message from './entities/message.entity';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}
  create(createMessageDto: CreateMessageDto) {
    console.log('message : ', createMessageDto);
    let newMessage: Message;
    if (createMessageDto.isChannel)
      newMessage = this.messagesRepository.create({
        ...createMessageDto,
        roomId: createMessageDto.receiverId,
      });
    else newMessage = this.messagesRepository.create(createMessageDto);
    this.messagesRepository.save(newMessage);
    return 'This action adds a new message';
  }

  async findAll() {
    return await this.messagesRepository.find();
  }

  async findOne(receiverId: string, user_id: string, isChannel: boolean) {
    if (isChannel) {
      return await this.messagesRepository.find({ roomId: receiverId });
    }
    return await this.messagesRepository.find({
      where: [
        { receiverId: receiverId, senderId: user_id },
        { receiverId: user_id, senderId: receiverId },
      ],
    });
    return `This action returns a #${receiverId} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
