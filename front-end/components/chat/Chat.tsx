/* eslint-disable @next/next/no-img-element */
import Router from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/Chat.module.css";
import ChatPannel from "./chatPannel";
import ChatSideBar from "./chatSideBar";
import { AppContext } from "../../context/AppContext";
import io from "socket.io-client";
import axios from "axios";
import { isContact } from "../../utils/utils";

export default function Chat() {
	const {
		state,
		setContacts,
		setChannels,
		setReceiver,
		setIsUserJoinedChannel,
		setMainUser,
	} = useContext(AppContext);
	const [windowWidth, setWindowWidth] = useState<any>(null);
	const [showContacts, setShowContacts] = useState(windowWidth === 1000);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
		fetchMainUser();
	}, []);

	async function fetchMainUser() {
		axios
			.get(`${process.env.SERVER_HOST}/users/me`, {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status === 200) {
					setMainUser({ ...res.data });
				}
			})
			.catch(() => {
				Router.push("/");
			});
	}

	useEffect(() => {
		console.log("state mainUser : effec ", state.mainUser);
		if (state.mainUser) {
			fetchFriends();
			fetchAllChannels();
		}
	}, [state.mainUser]);

	/*  Event Sockets namespace  */

	useEffect(() => {
		state.eventsSocket.on("A_USER_STATUS_UPDATED", (user: any) => {
			console.log("user status updated");
			setContactStatus(user.isOnline, user);
		});
		state.chatSocket.on("A_CHANNELS_STATUS_UPDATED", () => {
			fetchAllChannels();
		});
		state.eventsSocket.on("UPDATE_DATA", () => {
			fetchAllChannels();
			// setReceiver(null);
			console.log("fetch data ");
			fetchFriends();
		});
		state.chatSocket.on("A_CHANNELS_YOU_KICKED", () => {
			setIsUserJoinedChannel(false);
			setReceiver(null);
			fetchAllChannels();
		});
		state.chatSocket.on("YOU_GET_MUTED", () => {
			console.log("some  one get muted :::  999999");
			fetchAllChannels();
		});
		state.chatSocket.on("YOU_GET_UNMUTED", () => {
			console.log("some  one get unmuted :::  pppppp");
			fetchAllChannels();
		});
		state.chatSocket.on("A_CHANNELS_YOU_BANNED", () => {
			setIsUserJoinedChannel(false);
			setReceiver(null);
			fetchAllChannels();
		});
		state.chatSocket.on("ADMINS_STATUS_UPDATED", () => {
			console.log("a admins status updated ");
			fetchAllChannels();
		});

		return () => {
			state.eventsSocket.off("A_USER_STATUS_UPDATED");
			state.chatSocket.off("A_CHANNELS_STATUS_UPDATED");
			state.chatSocket.off("A_CHANNELS_YOU_KICKED");
			state.chatSocket.off("YOU_GET_MUTED");
			state.chatSocket.off("YOU_GET_UNMUTED");
			state.chatSocket.off("A_CHANNELS_YOU_BANNED");
			state.chatSocket.off("ADMINS_STATUS_UPDATED");
		};
	}, []);

	async function fetchFriends() {
		if (!state.mainUser) {
			fetchMainUser();
			return;
		}
		try {
			axios
				.get(
					`${process.env.SERVER_HOST}/users/id/${state.mainUser.id}/friends`,
					{
						withCredentials: true,
					}
				)
				.then((res) => {
					console.log("all users :", res.data);
					setContacts([...res.data]);
				});
		} catch {
			console.log("main user state :", state.mainUser);
			console.log("CANT GET ALL USERS");
		}
	}

	async function fetchAllChannels() {
		if (!state.mainUser) {
			fetchMainUser();
			return;
		}
		try {
			axios
				.get(`${process.env.SERVER_HOST}/rooms`, {
					withCredentials: true,
				})
				.then((res) => {
					console.log("all channels :", res.data);
					if (res.data) {
						console.log("receiver  ::: ", state.receiver);
						setChannels([...res.data]);
					}
				});
		} catch {
			console.log("CANT GET ALL channels");
		}
	}

	function setContactStatus(status: boolean, user: any) {
		console.log("set contacts ");
		let contacts = [...state.contacts];
		if (
			contacts.filter((contact) => {
				contact.id === user.id;
			}).length === 1
		) {
			contacts.map((user) => {
				if (user.id === user.id) {
					user.isOnline = status;
				}
			});
			setContacts([...contacts]);
		} else fetchFriends();
	}

	useEffect(() => {
		console.log("messages ", state.messages);
		if (state.messages.length > 0) {
			const lastMessage = state.messages.length - 1;
			if (state.messages[lastMessage].senderId === state.mainUser.id)
				console.log("main user message");
		}
	}, [state.messages]);

	const updateDimensions = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		updateDimensions();

		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	useEffect(() => {
		if (state.receiver && windowWidth <= 1000) setShowContacts(false);
		else setShowContacts(true);
	}, [state.receiver, windowWidth]);

	useEffect(() => {
		if (!state.contacts.length)
			setReceiver(null);
		else
		{
			state.contacts.forEach((contact:any) => {
				if (contact.id === state.receiver)
					return;
			});
			// receiver is blocked or block mainUser
			setReceiver(null);
		}
	}, [state.contacts])
	

	return (
		<>
			{state.mainUser && (
				<div className={styles.chatComponentStyle}>
					{!showContacts && (
						<button
							className={styles.chatDrawer}
							onClick={() => setShowContacts(!showContacts)}
						>
							<img
								width={20}
								height={20}
								src="/return-icon.png"
								alt="return-icon"
							/>{" "}
						</button>
					)}
					{showContacts && <ChatSideBar />}
					{windowWidth > 1000 ? (
						<ChatPannel />
					) : (
						!showContacts && <ChatPannel />
					)}
				</div>
			)}
		</>
	);
}
