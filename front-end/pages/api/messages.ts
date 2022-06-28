import { Message } from "../../components/chat/interfaces";
/*
----> user :{
  id: int;
  profile_id: int;
  created_at : date;
  user_name: string;
}
---> profile :
{
  id: int;
  first_name : string;
  last_name : string;
  avatar: image;
  user_id;
}

---> message:
{
  id: int;
  content : string;
  created_at : date();
  sender_id: int;
  reciver: int;
  room_id : int;
} 
----> room
{
  id: int ;
  room_id : int;
  room : name;
  owner_id : int;
  admins : user[];
  protected: boolean;
  password: string;
  avtar: string;
  room_type: enum[private, public, protected];
  created_at: date;
  banned_users : user[];
  muted_users : muted[];
}

---> muted : 
{
  id: int;
  user_id : int;
  muted_time : int;
}

----> Chat
{
  id: int ;
  chat_id : int;
  users: user[2];
}
---> messages-list :
{
  id: int;
  messages : meassage[];

}

rooms-list : room[];
contact-list : contact:[];

*/
