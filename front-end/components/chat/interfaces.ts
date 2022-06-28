import { ReactNode } from "react";
export interface AvatarProps {
  image?: any;
}

export interface MessageComponentProps{
  message: Message;
  mainUser : User;
}

export interface User {
  id?: string;
  profile_id?: string;
  image?: string;
  userName?: string;
  lastName?: string;
  firstName?: string;
  socketId?: string;
  status?: boolean;
  playing?: boolean;
  peer_to_peer_room_id?: string;
}
export interface Profile {
  id: string;
  image: any;
  first_name: string;
  last_name: string;
  avatar: string;
  user_id: string;
}

export interface Message {
  id?: string;
  content: string;
  created_at: string;
  creator: string;
  chat_room_id: string;
}


export interface ContactComponentProps
{
  contact: User;
  receiver: User | Room;
}
export interface RoomComponentProps
{
  room: Room;
  receiver: User | Room;
}

// export interface Contact {
//   id?: string;
//   image? : string;
//   user_name?: string;
//   first_name?: string;
//   last_name?: string;
//   is_online?: boolean;
//   is_playing?: boolean;
//   peer_to_peer_room_id?: string;
// }

enum roomType {
  private,
  public,
  protected,
}
export interface Room {
  id?: string;
  image? : string;
  room_name?: string;
  owner_id?: string;
  admins?: User[];
  protected?: boolean;
  password?: string;
  avtar?: string;
  room_type?: roomType;
  created_at?: string;
  banned_users?: User[];
  muted_users?: User[];
}


export interface ChatProps {
  mainUser: User;
}

export interface ChatLeftSideProps {
  mainUser?: User;
  user_contacts? : User[];
  user_rooms?: Room[];
  receiver? : User | Room;
  handleSelectReceiver: (receiver: User | Room)=> void;
}
