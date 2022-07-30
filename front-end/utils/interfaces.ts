import { ReactNode } from "react";
export interface AvatarProps {
  image?: any;
}

export interface MessageComponentProps{
  message: Message;
  mainUser : User;
}

export interface User {
  id: string;
  image: string;
  userName: string;
  lastName: string;
  firstName: string;
  isOnline: boolean;
  isPlaying: boolean;
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
  roomId?: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  createdAt: Date;
  content: string;
  isChannel: boolean;
}


export interface ContactComponentProps
{
  contact: User;
  receiver: User | Channel;
}
export interface ChannelComponentProps
{
  channel: Channel;
  receiver: User | Channel;
}

// export enum channelType {
//   private,
//   public,
// }
export interface Channel {
  id?: string;
  image? : string;
  roomName?: string;
  owner: string;
  admins?: string[];
  isProtected?: boolean;
  password?: string;
  avtar?: string;
  roomType?: string;
  created_at?: string;
  bannedUser?: string[];
  mutedUsers?: string[];
  ActiveUsers?: string[];
}


export interface ChatProps {
  mainUser: User;
}

export interface ChatLeftSideProps {
  mainUser?: User;
  user_contacts? : User[];
  user_channels?: Channel[];
  receiver? : User | Channel;
  handleSelectReceiver: (receiver: User | Channel)=> void;
}
