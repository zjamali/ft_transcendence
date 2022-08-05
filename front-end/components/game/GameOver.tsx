import ParticleWinner from "./ParticleWinner";
import ParticleBackground from "./ParticleBackground";
import style from "../../styles/GameOver.module.css";
import { data } from "./HomeGame";
import { Data } from "../../Library/Data";
import socket from "../../Library/Socket";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
export function GameOver({ curData }: any) {
	/*
	 ** set user status ins playing off :
	 */
	const { state } = useContext(AppContext);

	state.eventsSocket.emit("GAME_OVER", state.mainUser.id);
	/*
	 */

	let myVar = curData.get_Winner() ? (
		<div className={style.loser}>
			<h2>You Lose</h2>
			<div>
				<ParticleBackground />
			</div>
		</div>
	) : (
		<div className={style.win}>
			<h2>You Win</h2>
			<div>
				<ParticleWinner />
			</div>
		</div>
	);

	return (
		<div className={style.splashScreen}>
			<h2>Game Over</h2>
			{myVar}
		</div>
	);
}
