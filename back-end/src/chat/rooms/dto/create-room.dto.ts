import  User  from 'src/users/user.entity';
export class CreateRoomDto {
    id?: string;
    roomName: string;
    user1Id: string;
    user2Id: string;
}
