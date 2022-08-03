import Friend from './users/friend.entity';
import Message from './chat/messages/entities/message.entity';
import User from './users/user.entity';
import Room from './chat/rooms/entities/room.entity';
import { Games } from './game/enitites/game.entity';

const entities = [User, Message, Room, Friend, Games];

export { User, Message, Room, Friend, Games };
export default entities;
