import React, { ReactNode, createContext, useState, useRef } from "react";
import { Message, Channel, User } from "../utils/interfaces";
export const AppContext = createContext<any>({});

export const AppProvider = (props: any) => {
	const [session, setSession] = useState<any>(null);
	const [mainUser, setMainUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	// const [contacts, setContacts] = useState<ContactProps[]>([])
	const [contacts, setContacts] = useState<User[]>([]);
	//const [channels, setChannels] = useState<Channel[]>([])
	const [channels, setChannels] = useState<Channel[]>([]);
	const [receiver, setReceiver] = useState<User | Channel | null>(null);

	const [isUserJoinedChannel, setIsUserJoinedChannel] = useState<boolean>(
		false
	);
	// event socket
	const eventsSocket = useRef<any>(null);
	//chat socket if a reciver is set
	const chatSocket = useRef<any>(null);
	return (
		<AppContext.Provider
			value={{
				state: {
					session,
					mainUser,
					messages,
					contacts,
					channels,
					receiver,
					isUserJoinedChannel,
          eventsSocket,
          chatSocket,
				},
				setMessages,
				setContacts,
				setChannels,
				setReceiver,
				setMainUser,
				setSession,
				setIsUserJoinedChannel,
			}}
		>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppProvider;
