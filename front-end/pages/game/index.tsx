import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { HomeGame } from "../../components/game/HomeGame";
import ParticleBackground from "../../components/game/ParticleBackground";
import { AppContext } from "../../context/AppContext";

export function PingPong(props: any) {
	const { state, setMainUser } = useContext(AppContext);
	useEffect(() => {
		if (state.mainUser) {
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
					console.log("game get main user error");
				});
		}
	}, []);

	return (
		<div className="profile-content " style={{ height: '50%', alignItems: 'center', justifyContent: 'center'}}>
			{/* <ParticleBackground /> */}
			{state.mainUser && <HomeGame />}
		</div>
	);
}

export default PingPong;
