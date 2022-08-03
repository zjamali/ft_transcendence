import io from "socket.io-client";

// event socket
export const eventsSocket = io("http://localhost:5000/events", {
    withCredentials: true,
});
//chat socket if a reciver is set
export const chatSocket = io("http://localhost:5000/chat", {
    withCredentials: true,
});