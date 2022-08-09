import io from "socket.io-client";

// event socket
export const eventsSocket = io("http://192.168.99.121:5000/events", {
	withCredentials: true,
});
//chat socket if a reciver is set
export const chatSocket = io("http://192.168.99.121:5000/chat", {
	withCredentials: true,
});
