import React, { ReactNode, createContext, useState } from 'react'
import { Message, Room , User} from '../components/chat/interfaces'
import {v4 as uuidv4} from 'uuid'

import { api_contacts } from '../pages/api/contacts'
import { api_rooms } from '../pages/api/rooms'
export const ChatContext = createContext<any>(null)

export const ChatProvider = (props: any) => {
  const [session, setSession] = useState<any>(null);
  const [mainUser, setMainUser] = useState({
    image: '/images/contacts/default_avatar.jpeg',
    userName: '',
    lastName: '',
    firstName: '',
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageinput] = useState<string>('')
  // const [contacts, setContacts] = useState<ContactProps[]>([])
  const [contacts, setContacts] = useState<User[]>([])
  // const [rooms, setRomms] = useState<Room[]>([])
  const [rooms, setRomms] = useState<Room[]>([])
  const [receiver, setReceiver] = useState<User | Room | null>(null)
  const [chatSockets, setsChatSockets] = useState<any>(null);
  const [alertSockets, setsAlertSockets] = useState<any>(null);
  return (
    <ChatContext.Provider
      value={{
        state: {
          session,
          mainUser,
          messages,
          messageInput,
          contacts,
          rooms,
          receiver,
        },
        sockets:{
          chat :chatSockets,
          alerts: alertSockets,
        },
        setMessages,
        setMessageinput,
        setContacts,
        setRomms,
        setReceiver,
        setMainUser,
        setsChatSockets,
        setsAlertSockets,
        setSession,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
