import { RoomType } from '../entities/room.entity';
export class CreateRoomDto {
  id?: string;
  roomName: string;
  ActiveUsers?: string[];
  bannedUser?: string[];
  mutedUsers?: string[];
  owner: string;
  admins?: string[];
  roomType: RoomType;
  isProtected: boolean;
  password?: string;
}
