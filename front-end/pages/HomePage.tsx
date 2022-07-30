import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Chat from "./chat";
import ChatProvider, { AppContext } from "../context/AppContext";
import Login from "./login";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Profile from "../components/Profile/Profile";
import { useCookies } from "react-cookie";

export default function HomePage() {
	const { state, setMainUser, setLogin } = useContext(AppContext);
	const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
	useEffect(() => {
		console.log("index cookie :", cookies);

		axios
			.get("http://localhost:5000/users/me", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setMainUser({ ...res.data });
				}
			})
			.catch(() => {
				setLogin(false);
			});
	}, []);

	useEffect(() => {
		if (state.mainUser) setLogin(true);
	}, [state.mainUser]);
	return (
		<>
			{!state.login && !state.mainUser ? (
				<Login login={state.login} setLogin={setLogin} />
			) : (
				<Profile />
			)}
		</>
	);
}
