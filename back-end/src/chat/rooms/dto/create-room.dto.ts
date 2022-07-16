export class CreateRoomDto {
  id?: string;
  roomName: string;
  ActiveUsers?: string[];
  bannedUser?: string[];
  mutedUsers?: string[];
  owner: string;
  admins?: string[];
  roomType: string;
  isProtected: boolean;
  password?: string;
  image?: string;
}
