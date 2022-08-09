import { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/LiveGame.module.css";
import CurrentGame from "./CurrentGame";
import socket from "../../Library/Socket";
import { AppContext } from "../../context/AppContext";
import { useRouter } from "next/router";
import Link from "next/link";

export function LiveGame() {
	const [games, setGames] = useState([]);
	const { state, setOnlineGames } = useContext(AppContext);
  // const router = useRouter();

	useEffect(() => {
		socket.on("receive_games", (data: any) => {
			const tmp = JSON.parse(data);
			if (tmp.hasOwnProperty("games")) {
				setGames(tmp.games);
				setOnlineGames(tmp.games);
			}
		});
		return () => {
			socket.off("receive_games");
		};
	}, [games]);

	const gameContainer = useRef(null);
	return (
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
			{games.length !== 0 ? (
				games.map((game, index) => {
					return (
						<Link
							href={{
								pathname: "live/[liveId]",
								query: {
									liveId: `${index}`,
								},
							}}
							key={index}
						>
							<a style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
								<CurrentGame
									index={index}
									key={index}
									game={game}
									gameContainer={gameContainer}
								/>
							</a>
						</Link>
					);
				})
			) : (
				<div
					className={styles.empty}
					style={{ fontFamily: "Deltha, sans-serif" }}
				>
					<h1>NOTHING TO WATCH</h1>
				</div>
			)}
		</div>
	);
}

export default LiveGame;
