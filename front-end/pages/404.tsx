import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import loginStyle from "../styles/Chat.module.css";
import { v4 as uuidv4 } from "uuid";

export default function NotFound(props: any) {
	// const { state, setMainUser } = useContext(AppContext)
	useEffect(() => {
		// window.history.replaceState(null, '', '/');
	}, [])
	
	return (
        <div className="profile-content">
			<img src="/404.png" alt="404 image"/>
		</div>
	);
}
