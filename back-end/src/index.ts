import Message from './chat/messages/entities/message.entity';
import User from './users/user.entity';
import Room from './chat/rooms/entities/room.entity';

const entities = [User, Message, Room];

export { User, Message, Room};
export default entities;
