import {User, Room} from '../components/chat/interfaces'

export function isContact(
  reciever: User | Room
): reciever is User {
  return (reciever as User).userName !== undefined;
}

export function checkMessage(input: string) {
  for (let i = 0; i < input.length; i++) {
    if (input[i] != ' ') return false
  }
  return true
}