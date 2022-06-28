import { Room } from "../../components/chat/interfaces";
import { v4 as uuidv4 } from "uuid";

export const api_rooms: Room[] = [
  {
    id: uuidv4(),
    image: "/images/rooms/room.jpeg",
    room_name: "room 1",
  },
  {
    id: uuidv4(),
    image: "/images/rooms/room.jpeg",
    room_name: "room 2",
  },
  {
    id: uuidv4(),
    image: "/images/rooms/room.jpeg",
    room_name: "room 3",
  },
  {
    id: uuidv4(),
    image: "/images/rooms/room.jpeg",
    room_name: "room 4",
  },
];
