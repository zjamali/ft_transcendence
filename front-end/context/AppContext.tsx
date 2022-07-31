import React, { ReactNode, createContext, useState, useRef } from "react";
import { Message, Channel, User } from "../utils/interfaces";
export const AppContext = createContext<any>({});

export const AppProvider = (props: any) => {
  const [login, setLogin] = useState<boolean>(false)
	const [mainUser, setMainUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	// const [contacts, setContacts] = useState<ContactProps[]>([])
	const [contacts, setContacts] = useState<User[]>([]);
	//const [channels, setChannels] = useState<Channel[]>([])
	const [channels, setChannels] = useState<Channel[]>([]);
	const [receiver, setReceiver] = useState<User | Channel | null>(null);
	const [friends, setFriends] = useState<User | null>(null);

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
          login,
		  friends,
					mainUser,
					messages,
					contacts,
					channels,
					receiver,
					isUserJoinedChannel,
          eventsSocket,
          chatSocket,
				},
        setLogin,
				setMessages,
				setContacts,
				setChannels,
				setReceiver,
				setFriends,
				setMainUser,
				setIsUserJoinedChannel,
			}}
		>
			{props.children}
		</AppContext.Provider>
	);
};

const AppConsumer = AppContext.Consumer;

export default AppProvider;
export {AppConsumer};
