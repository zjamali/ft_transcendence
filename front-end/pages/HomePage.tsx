import { AppContext } from "../context/AppContext";
import Login from "./login";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Profile from "../components/Profile/Profile";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import TwoFactorAuth from "./TwoFactorAuth";

export default function HomePage() {
	const { state, setMainUser, setLogin } = useContext(AppContext);
	const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

	const router = useRouter();
	if (router.query.login) {
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
	}
	console.log("router : --> ", router.pathname);
	useEffect(() => {
		if (cookies.access_token) {
			axios
				.get("http://localhost:5000/users/me", {
					withCredentials: true,
				})
				.then((res) => {
					if (res.status === 200) {
						setMainUser({ ...res.data });
					}
				})
				.catch(() => {
					setLogin(false);
				});
		}
	}, []);

	useEffect(() => {
		if (state.mainUser) setLogin(true);
	}, [state.mainUser]);
	return (
		// <div style={{backgroundColor: 'red'}}>
		// 	{!state.login && !state.mainUser ? (
		// 		<Login login={state.login} setLogin={setLogin} />
		// 	) : (
		// 		<Profile />
		// 	)}
		// </div>
		<>{router.query.twoFa ? <TwoFactorAuth /> : <Login />}</>
	);
}
