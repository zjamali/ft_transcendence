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
	
	useEffect(() => {
		if (cookies.access_token) {
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
					setLogin(false);
				});
		}
	}, []);

	useEffect(() => {
		if (state.mainUser) setLogin(true);
	}, [state.mainUser]);
	return (
		<>{router.query.twoFa ? <TwoFactorAuth /> : <Login />}</>
	);
}
