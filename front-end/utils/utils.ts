import axios from 'axios';
import {User, Channel} from './interfaces'

export function isContact(
  reciever: User | Channel
): reciever is User {
  return (reciever as User).userName !== undefined;
}

export function checkMessage(input: string) {
  for (let i = 0; i < input.length; i++) {
    if (input[i] != ' ') return false
  }
  return true
}

export function addFriend(sender:string, target: string )
{
  axios.post('http://localhost:5000/users/send',  { id1: sender , id2: target } , {withCredentials : true}).then((data)=> {
    console.log("post friend request :",data);
  })
}
export function acceptFriendRequest(relatedUserId: string)
{
  axios.post('http://localhost:5000/users/accept',{ relatedUserId: relatedUserId},  {withCredentials : true}).then((data)=> {
    console.log("accep friend request :",data);
  })
}
export function unfriend(relatedUserId: string)
{
  axios.post('http://localhost:5000/users/unfriend',{ relatedUserId: relatedUserId},  {withCredentials : true}).then((data)=> {
    console.log("unfreind  request :",data);
  })
}
