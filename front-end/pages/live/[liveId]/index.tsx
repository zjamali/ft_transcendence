import { useRouter } from "next/router";
import * as React from "react";
import CurrentGame from "../../../components/game/CurrentGame";
import { AppContext } from "../../../context/AppContext";
import { Data, StateGame } from "../../../Library/Data";
import socket from "../../../Library/Socket";
import Game from "../../game";

export interface IAppProps {}

export default function LiveIndex(props: IAppProps) {
	const router = useRouter();
	const { liveId } = router.query;
	const { state } = React.useContext(AppContext);
	let data = null;
	data = state.onlineGames[Number(liveId)];
    
	const gameContainer = React.useRef(null);
	return (
		<div className="profile-content">
			<div
				ref={gameContainer}
				className="home-game-container"
				style={{
					flexDirection: "column",
					justifyContent: "flex-start",
					alignItems: "center",
					padding: "10px",
				}}
			>
				<div
					style={{ width: "100%", height: "100%" }}
					ref={gameContainer}
				>
                    {!(data.player_1.score === 5 || data.player_2.score === 5)  
                    ?
                        <CurrentGame
                        game={data}
                        gameContainer={gameContainer}
						/>

                        : " game over "
                    }
				</div>
			</div>
		</div>
	);
}
