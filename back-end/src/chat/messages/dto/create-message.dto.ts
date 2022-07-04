export class CreateMessageDto {
  roomId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  createdAt: Date;
  content: string;
}
