import style from "../../styles/GameOver.module.css";
import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { StateGame } from "../../Library/Data";
import { Button } from "@mui/material";
export function GameOver({ data, setIsGame, setCurrentState }: any) {
	/*
	 ** set user status ins playing off :
	 */
	const { state } = useContext(AppContext);
	useEffect(() => {
		state.eventsSocket.emit("GAME_OVER", state.mainUser.id);
	}, []);

	return (
		<div className="game-over">
			{ data.get_Winner() ? (
					<div className="g-o-lost">
						<div style={{color: "#ff3030"}}>Game Over</div>
						<div className="game-over-button">
							<Button variant="outlined" color="warning" size="medium" onClick={
								() => {
									setIsGame(false);
									setCurrentState(StateGame.WAIT);
									data.set_State(StateGame.WAIT);
								}
							}>
								PLAY AGAIN
							</Button>
						</div>
					</div>
				):(
					<div className="g-o-win">
						<div>YOU WIN</div>
						<div className="game-over-button">
							<Button variant="outlined" color="warning" size="medium" onClick={
								() => {
									setIsGame(false);
									setCurrentState(StateGame.WAIT);
									data.set_State(StateGame.WAIT);
								}
							}>
								PLAY AGAIN
							</Button>
						</div>
					</div>
				)
			}
		</div>
	);
}
