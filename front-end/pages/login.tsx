import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import loginStyle from "../styles/Chat.module.css";
import { v4 as uuidv4 } from "uuid";

export default function Login(props: any) {
	// const { state, setMainUser } = useContext(AppContext)
	useEffect(() => {
		window.history.replaceState(null, '', '/');
	}, [])
	
	return (
		<div className={loginStyle.container}>
			<div className={loginStyle.loginContainner}>
				<form
					className={loginStyle.loginForm}
					action="http://192.168.99.121:5000/auth/42"
				>
					<img src="/42logo-white.svg" alt="42logo" />
					<button type="submit">login</button>
				</form>
			</div>
		</div>
	);
}
