/* eslint-disable @next/next/no-img-element */
import Router from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../styles/Chat.module.css";
import ChatPannel from "../components/chat/chatPannel";
import ChatSideBar from "../components/chat/chatSideBar";
import NoReceiver from "../components/chat/noReceiver";
import { ChatContext } from "../context/chatContext";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { Channel } from "../utils/interfaces";
import Header from "../components/Profile/Header";
import SideBar from "../components/Profile/SideBar";

export default function Chat() {
	const {
		state,
		setContacts,
		setChannels,
		setReceiver,
		setIsUserJoinedChannel,
		setMainUser,
	} = useContext(ChatContext);
	// event socket
	const eventsSocket = useRef<any>(null);
	//chat socket if a reciver is set
	const chatSocket = useRef<any>(null);
	const [windowWidth, setWindowWidth] = useState<any>(null);
	const [showContacts, setShowContacts] = useState(windowWidth === 1000);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
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
	}, []);

	/*  Event Sockets namespace  */

	useEffect(() => {
		//////
		/* creation Sockets start */
		if (!eventsSocket.current) {
			eventsSocket.current = io("http://localhost:5000/events", {
				withCredentials: true,
			});
			eventsSocket.current.on("connect_failed", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			eventsSocket.current.on("connect_error", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			eventsSocket.current.on("connect_failed", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			eventsSocket.current.on("disconnect", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
		}
		try {
			eventsSocket.current.on("connect_failed", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			eventsSocket.current.on("connect_error", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			eventsSocket.current.on("connect_failed", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			eventsSocket.current.on("disconnect", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			chatSocket.current.on("connect_failed", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			chatSocket.current.on("connect_error", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			chatSocket.current.on("connect_failed", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			chatSocket.current.on("disconnect", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});

			fetchFriends();
			fetchAllChannels();
			eventsSocket.current.on("A_USER_STATUS_UPDATED", (user: any) => {
				setContactStatus(user.isOnline, user);
			});
			chatSocket.current.on("A_CHANNELS_STATUS_UPDATED", () => {
				fetchAllChannels();
			});

			chatSocket.current.on("A_CHANNELS_YOU_KICKED", () => {
				setIsUserJoinedChannel(false);
				setReceiver(null);
				fetchAllChannels();
			});
			chatSocket.current.on("YOU_GET_MUTED", () => {
				// setReceiver(null)
				// setReceiver({ ...room_data })
				console.log("some  one get muted :::  999999");
				fetchAllChannels();
			});
			chatSocket.current.on("YOU_GET_UNMUTED", () => {
				console.log("some  one get unmuted :::  pppppp");
				fetchAllChannels();
			});
			chatSocket.current.on("A_CHANNELS_YOU_BANNED", () => {
				setIsUserJoinedChannel(false);
				setReceiver(null);
				fetchAllChannels();
			});
			chatSocket.current.on("ADMINS_STATUS_UPDATED", () => {
				console.log("a admins status updated ");
				fetchAllChannels();
			});
		} catch (error) {
			console.log("sockets error", error);
		}

		return () => {
			console.log("close sockets");
			eventsSocket.current.disconnect();
		};
	}, [state.mainUser]);

	async function fetchFriends() {
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
			console.log("CANT GET ALL USERS");
		}
	}

	async function fetchAllChannels() {
		console.log("fetch channels");
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

	/*****  end events */

	useEffect(() => {
		//////
		/* creation Sockets start */
		if (!chatSocket.current) {
			chatSocket.current = io("http://localhost:5000/chat", {
				withCredentials: true,
			});
			chatSocket.current.on("connect_failed", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			chatSocket.current.on("connect_error", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			chatSocket.current.on("connect_failed", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
			chatSocket.current.on("disconnect", () => {
				console.log(
					"Sorry, there seems to be an issue with the connection!"
				);
			});
		}
	}, []);

	/*** chat sockets  */

	/**** end chat sockets  */
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
				<>
					<Header />
					<div className="profile-container">
						<SideBar/>
						<div className={styles.chatComponentStyle}>
							{!showContacts && (
								<button
									className={styles.chatDrawer}
									onClick={() =>
										setShowContacts(!showContacts)
									}
								>
									<img
										width={20}
										height={20}
										src="/return-icon.png"
										alt="return-icon"
									/>{" "}
								</button>
							)}
							{showContacts && (
								<ChatSideBar chatSocket={chatSocket} />
							)}
							{windowWidth > 1000 ? (
								<ChatPannel chatSocket={chatSocket} />
							) : (
								!showContacts && (
									<ChatPannel chatSocket={chatSocket} />
								)
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}
