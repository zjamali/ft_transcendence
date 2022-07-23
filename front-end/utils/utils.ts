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