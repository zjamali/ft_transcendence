import Friend from './users/entities/friend.entity';
import Message from './chat/messages/entities/message.entity';
import Room from './chat/rooms/entities/room.entity';
import Games from './game/enitites/game.entity';
import User from './users/entities/user.entity';

const entities = [User, Message, Room, Friend, Games];

export { User, Message, Room, Friend, Games };
export default entities;
