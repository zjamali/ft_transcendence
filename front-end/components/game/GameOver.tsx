import style from "../../styles/GameOver.module.css";
import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { StateGame } from "../../Library/Data";
export function GameOver({ data, setIsGame, setCurrentState }: any) {
	/*
	 ** set user status ins playing off :
	 */
	const { state } = useContext(AppContext);
	useEffect(() => {
		state.eventsSocket.emit("GAME_OVER", state.mainUser.id);
	}, []);

	/*
	 */

	const myVar: JSX.Element = data.get_Winner() ? (
		<div className={style.loser}>
			<h2>You Lose</h2>
			<button
				onClick={() => {
					setIsGame(false);
					setCurrentState(StateGame.WAIT);
					data.set_State(StateGame.WAIT);
				}}
			>
				RETRY
			</button>
		</div>
	) : (
		<div className={style.win}>
			<h2>You Win</h2>
			<button
				onClick={() => {
					setIsGame(false);
					setCurrentState(StateGame.WAIT);
					data.set_State(StateGame.WAIT);
				}}
			>
				RETRY
			</button>
			{/* <div>
							<ParticleWinner />
						</div> */}
		</div>
	);

	return (
		<div className={style.splashScreen}>
			<h2>Game Over</h2>
			{myVar}
		</div>
	);
}
