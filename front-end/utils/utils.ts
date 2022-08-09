import axios from "axios";
import { eventsSocket } from "../context/sockets";
import { User, Channel } from "./interfaces";

export function isContact(reciever: User | Channel): reciever is User {
	return (reciever as User).userName !== undefined;
}

export function checkMessage(input: string) {
	for (let i = 0; i < input.length; i++) {
		if (input[i] != " ") return false;
	}
	return true;
}

export function addFriend(sender: string, target: string) {
	//remove sender plzplz
	axios
		.post(
			`${process.env.SERVER_HOST}/users/send`,
			{ relatedUserId: target },
			{ withCredentials: true }
		)
		.then((data) => {
			console.log("post friend request :", data);
			eventsSocket.emit("SEND_FRIEND_REQUEST", {
				sender: sender,
				target: target,
			});
		});
}
export function acceptFriendRequest(accpter: string, relatedUserId: string) {
	axios
		.post(
			`${process.env.SERVER_HOST}/users/accept`,
			{ relatedUserId: relatedUserId },
			{ withCredentials: true }
		)
		.then((data) => {
			console.log("accep friend request :", data);
			eventsSocket.emit("ACCEPT_FREIND_REQUEST", {
				accpter,
				relatedUserId,
			});
		});
}
export function unfriend(denier: string, relatedUserId: string) {
	axios
		.post(
			`${process.env.SERVER_HOST}/users/unfriend`,
			{ relatedUserId: relatedUserId },
			{ withCredentials: true }
		)
		.then((data) => {
			console.log("unfreind  request :", data);
			eventsSocket.emit("DENY_FREIND_REQUEST", {
				denier,
				relatedUserId,
			});
		});
}
export function blockUser(blocker: string, relatedUserId: string) {
	axios
		.post(
			`${process.env.SERVER_HOST}/users/block`,
			{ relatedUserId: relatedUserId },
			{ withCredentials: true }
		)
		.then((data) => {
			console.log("block  request :", data);
			eventsSocket.emit("BLOCK_A_USER", {
				blocker,
				target: relatedUserId,
			});
		});
}
export function unBlockUser(unblocker: string, relatedUserId: string) {
	axios
		.post(
			`${process.env.SERVER_HOST}/users/unblock`,
			{ relatedUserId: relatedUserId },
			{ withCredentials: true }
		)
		.then((data) => {
			console.log("unblock  request :", data);
			eventsSocket.emit("UNBLOCK_A_USER", {
				unblocker,
				target: relatedUserId,
			});
		});
}
