/* eslint-disable @next/next/no-img-element */
import Router from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../styles/Chat.module.css";
import ChatPannel from "../../components/chat/chatPannel";
import ChatSideBar from "../../components/chat/chatSideBar";
import NoReceiver from "../../components/chat/noReceiver";
import { AppContext } from "../../context/AppContext";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { Channel } from "../../utils/interfaces";
import Header from "../../components/Profile/Header";
import SideBar from "../../components/Profile/SideBar";
import Chat from "../../components/chat/Chat";

export default function ChatPage() {
	const { state, setMainUser } = useContext(AppContext);

	useEffect(() => {
		fetchMainUser();
	}, []);

	async function fetchMainUser() {
		axios
			.get("http://192.168.99.121:5000/users/me", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setMainUser({ ...res.data });
				}
			})
			.catch(() => {
				Router.push("/");
			});
	}

	return (
		<div className="profile-content">{state.mainUser && <Chat />}</div>
	);
}
