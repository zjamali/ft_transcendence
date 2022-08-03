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
				.get("http://localhost:5000/users/me", {
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
		<div className="game-content ">
			<ParticleBackground />
			{state.mainUser && <HomeGame />}
		</div>
	);
}

export default PingPong;
