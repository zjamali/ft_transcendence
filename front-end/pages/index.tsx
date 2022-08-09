import type { NextPage } from "next";
import { AppContext } from "../context/AppContext";
import Login from "./login";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Profile from "../components/Profile/Profile";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

const Home: NextPage = () => {
	const { state, setMainUser, setLogin } = useContext(AppContext);
	const router = useRouter();
	if (router.query.login) {
		axios
			.get(`${process.env.SERVER_HOST}/users/me`, { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setMainUser({ ...res.data });
				}
			})
			.catch(() => {
				setLogin(false);
			});
	}
	// useEffect(() => {
	// 	axios
	// 		.get(`${process.env.SERVER_HOST}/users/me`, { withCredentials: true })
	// 		.then((res) => {
	// 			if (res.status === 200) {
	// 				setMainUser({ ...res.data });
	// 			}
	// 		})
	// 		.catch(() => {
	// 			setLogin(false);
	// 		});
	// }, []);

	useEffect(() => {
		if (state.mainUser) setLogin(true);
	}, [state.mainUser]);
	return (
		<div style={{ width: "100%", height: "100%" }}>
			{!state.login && !state.mainUser ? (
				<Login login={state.login} setLogin={setLogin} />
			) : (
				<Profile />
			)}
		</div>
	);
};

export default Home;
