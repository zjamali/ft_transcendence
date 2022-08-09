import { io } from "socket.io-client";

const socket = io("http://192.168.99.121:5000/game");

export default socket;
