import io from "socket.io-client";

// event socket
export const eventsSocket = io(`${process.env.SERVER_HOST}/events`, {
	withCredentials: true,
});
//chat socket if a reciver is set
export const chatSocket = io(`${process.env.SERVER_HOST}/chat`, {
	withCredentials: true,
});
