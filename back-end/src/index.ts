import Friend from './users/friend.entity';
import Message from './chat/messages/entities/message.entity';
import User from './users/user.entity';
import Room from './chat/rooms/entities/room.entity';

const entities = [User, Message, Room, Friend];

export { User, Message, Room, Friend };
export default entities;
