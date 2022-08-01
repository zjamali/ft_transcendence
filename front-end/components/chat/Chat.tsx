/* eslint-disable @next/next/no-img-element */
import Router from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/Chat.module.css";
import ChatPannel from "./chatPannel";
import ChatSideBar from "./chatSideBar";
import { AppContext } from "../../context/AppContext";
import io from "socket.io-client";
import axios from "axios";

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
			.get("http://localhost:5000/users/me", { withCredentials: true })
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
		console.log("chat update");
		//////
		/* creation Sockets start */
		if (!state.eventsSocket.current) {
			state.eventsSocket.current = io("http://localhost:5000/events", {
				withCredentials: true,
			});
		}
		if (!state.chatSocket.current) {
			state.chatSocket.current = io("http://localhost:5000/chat", {
				withCredentials: true,
			});
		}
		try {
			state.eventsSocket.current.on(
				"A_USER_STATUS_UPDATED",
				(user: any) => {
					console.log("user status updated");
					setContactStatus(user.isOnline, user);
				}
			);
			state.chatSocket.current.on("A_CHANNELS_STATUS_UPDATED", () => {
				fetchAllChannels();
			});

			state.chatSocket.current.on("A_CHANNELS_YOU_KICKED", () => {
				setIsUserJoinedChannel(false);
				setReceiver(null);
				fetchAllChannels();
			});
			state.chatSocket.current.on("YOU_GET_MUTED", () => {
				console.log("some  one get muted :::  999999");
				fetchAllChannels();
			});
			state.chatSocket.current.on("YOU_GET_UNMUTED", () => {
				console.log("some  one get unmuted :::  pppppp");
				fetchAllChannels();
			});
			state.chatSocket.current.on("A_CHANNELS_YOU_BANNED", () => {
				setIsUserJoinedChannel(false);
				setReceiver(null);
				fetchAllChannels();
			});
			state.chatSocket.current.on("ADMINS_STATUS_UPDATED", () => {
				console.log("a admins status updated ");
				fetchAllChannels();
			});
		} catch (error) {
			console.log("sockets error", error);
		}

		return () => {
			console.log("close sockets");
			// state.eventsSocket.current.disconnect();
			// state.chatSocket.cureent.disconnect();
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
					`http://localhost:5000/users/id/${state.mainUser.id}/friends`,
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
				.get("http://localhost:5000/rooms", { withCredentials: true })
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
