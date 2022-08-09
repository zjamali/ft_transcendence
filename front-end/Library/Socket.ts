import { io } from "socket.io-client";

const socket = io(`${process.env.SERVER_HOST}/game`);

export default socket;
