import React, { ReactNode, createContext, useState } from 'react'
import { Message, Channel , User} from '../utils/interfaces'
import {v4 as uuidv4} from 'uuid'

import { api_contacts } from '../pages/api/contacts'
import { api_rooms } from '../pages/api/rooms'
export const ChatContext = createContext<any>({});

export const ChatProvider = (props: any) => {
  const [session, setSession] = useState<any>(null);
  const [mainUser, setMainUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([])
  // const [contacts, setContacts] = useState<ContactProps[]>([])
  const [contacts, setContacts] = useState<User[]>([])
  //const [channels, setChannels] = useState<Channel[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [receiver, setReceiver] = useState<User | Channel | null>(null)
  return (
    <ChatContext.Provider
      value={{
        state: {
          session,
          mainUser,
          messages,
          contacts,
          channels,
          receiver,
        },
        setMessages,
        setContacts,
        setChannels,
        setReceiver,
        setMainUser,
        setSession,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
