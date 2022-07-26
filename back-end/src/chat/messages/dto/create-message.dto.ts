export class CreateMessageDto {
  roomId?: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  createdAt: string;
  content: string;
  isChannel: boolean;
}
