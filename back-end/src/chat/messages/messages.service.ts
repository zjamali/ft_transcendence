import Message from './entities/message.entity';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}
  create(createMessageDto: CreateMessageDto) {
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
      return await this.messagesRepository.find({
        where: { roomId: receiverId },
      });
    }
    return await this.messagesRepository.find({
      where: [
        { receiverId: receiverId, senderId: user_id },
        { receiverId: user_id, senderId: receiverId },
      ],
    });
  }
  async deleteRoomMessages(room_id: string) {
    const messagesToDelete = await this.messagesRepository.find({
      where: {
        roomId: room_id,
      },
    });
    await this.messagesRepository.remove(messagesToDelete);
  }
}
