import React, { ReactNode, createContext, useState } from 'react'
import { Message, Channel , User} from '../utils/interfaces'
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

  const [isUserJoinedChannel, setIsUserJoinedChannel] = useState<boolean>(false);

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
          isUserJoinedChannel
        },
        setMessages,
        setContacts,
        setChannels,
        setReceiver,
        setMainUser,
        setSession,
        setIsUserJoinedChannel
      }}
    >
      {props.children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
