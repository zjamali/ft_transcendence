import { useContext, useEffect, useState } from "react";
import { Data, StateGame } from "../../Library/Data";
import socket from "../../Library/Socket";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Setting from "./Setting";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "@mui/material";
import SportsEsportsTwoToneIcon from "@mui/icons-material/SportsEsportsTwoTone";

import { eventsSocket } from "../../context/sockets";
import Game from "./Game";

//NOTE - Initiale data and Information about all Game like (ball, paddle, score, width, height, canvas)
export let data = new Data(1200, 600);

export function HomeGame() {
	const [isGame, setIsGame] = useState(false);
	const [isSetting, setSetting] = useState(true);
	const [currentState, setCurrentState] = useState(data.get_State());
	const { state } = useContext(AppContext);

	const [accepGame, setAccepGame] = useState(false);
	const handleGame = async () => {
		setCurrentState(StateGame.WAIT);
		await axios
			.get("http://localhost:5000/users/me", {
				withCredentials: true,
			})
			.then((res) => {
				socket.emit("join_match", {
					user: res.data,
				});
				socket.on("Playing", (payload: any) => {
					if (payload.playing) {
						data.set_userOne(payload.first);
						data.set_userTwo(payload.second);

						data.set_State(StateGame.PLAY);
					}
					setCurrentState(StateGame.PLAY);
				});
			});
		setIsGame(true);
	};
	const handleSetting = () => {
		setSetting(false);
	};

	useEffect(() => {
		eventsSocket.on("STAR_PLAYING", (payload: any) => {
			console.log(" start the game", payload);
			gameInviteDefHandler(payload.room_id);
		});

		return () => {
			eventsSocket.off("STAR_PLAYING");
		};
	}, []);

	// socket.on("Playing", (payload: any) => {
	//   if (payload.playing) {
	//     data.set_userOne(payload.first);
	//     data.set_userTwo(payload.second);
	//     data.set_State(1);
	//   }
	// );
	const gameObsHandler = () => {
		// const token = Cookies.get("access_token");
		// socket.emit("join_match", {
		//   access_token: token,
		//   type: "obstacle",
		// });
		// setIsGame(true);
	};

	const gameInviteDefHandler = async (room_id: string) => {
		// const token = Cookies.get("access_token");
		socket.emit("join_match", {
			user: state.mainUser,
			room_id: room_id,
		});
		socket.on("Playing", (payload: any) => {
			if (payload.playing) {
				data.set_userOne(payload.first);
				data.set_userTwo(payload.second);

				data.set_State(1);
			}
			setCurrentState(1);
		});
		setIsGame(true);
	};

	// 	socket.on("Playing", (payload: any) => {
	// 		if (payload.playing) {
	// 			data.set_userOne(payload.first);
	// 			data.set_userTwo(payload.second);
	// 			data.set_State(1);
	// 		}
	// 		setCurrentState(1);
	// 	});
	// 	setIsGame(true);
	// };

	// <>
	// 	{!isSetting && <Setting setSetting={setSetting} data={data} />}
	// 	{!isGame ? (
	// 		<div className={styles.container}>
	// 			<div className={styles.game}>
	// 				<img src="/pingpong.png" alt="Ping Pong Game" />
	// 			</div>
	// 			<div className={styles.about}>
	// 				<div>
	// 					<h1>
	// 						Ping
	// 						<img
	// 							src="/racket.png"
	// 							alt="racket"
	// 							width="80px"
	// 							height="60px"
	// 						/>
	// 						Pong
	// 					</h1>
	// 					<p>
	// 						PING PON is a table tennis game where you can
	// 						enjoy a real match experience.
	// 						<br />
	// 						You can enjoy the feeling of an actual table
	// 						tennis by tossing and serving the ball, and
	// 						hitting back to a different direction by
	// 						adjusting the angle of the racket.
	// 						<br />
	// 						You can discorver it by yourself &nbsp;
	// 						<span className={styles.emoji}>😉</span>
	// 					</p>
	// 					<div className={styles.btn}>
	// 						<button
	// 							className={styles.btnDef}
	// 							onClick={handleGame}
	// 						>
	// 							PLAY
	// 						</button>
	// 						<button
	// 							className={styles.btnObs}
	// 							onClick={handleSetting}
	// 						>
	// 							SETTING
	// 						</button>
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	) : (
	// 		<Game
	// 			data={data}
	// 			currentState={currentState}
	// 			setCurrentState={setCurrentState}
	// 		/>
	// 	)}
	// </>
	return (
		<div className="home-game-container">
			{!isSetting ? (
				<Setting setSetting={setSetting} data={data} />
			) : (
				<div className="home-game-content">
					<div
						style={{
							color: "#919eab",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<h1 className="game-header" style={{}}>
							Ping Pong Game
						</h1>
					</div>
					{!isGame ? (
						<div className="game-container-data">
							<div className="game-picture">
								<img
									src="/pingpong.png"
									alt="Ping Pong Game"
									style={{
										width: "100%",
										height: "100%",
										objectFit: "contain",
									}}
								/>
							</div>
							<div className="text-buttons-container">
								<div className="game-text">
									PING PONG is a table tennis game where you
									can enjoy a real match experience.
									<br />
									You can enjoy the feeling of an actual table
									tennis by tossing and serving the ball, and
									hitting back to a different direction by
									adjusting the angle of the racket.
									<br />
									You can discorver it by yourself &nbsp;
								</div>
								<div className="game-buttons">
									<Button
										variant="outlined"
										sx={{
											"@media (max-width: 1200px)": {
												width: "117px",
												fontSize: "9px",
												height: "40px",
											},
										}}
										color="warning"
										size="large"
										onClick={handleGame}
										startIcon={<SportsEsportsTwoToneIcon />}
									>
										Play now
									</Button>
									<Button
										variant="outlined"
										sx={{
											"@media (max-width: 1200px)": {
												width: "100px",
												fontSize: "12px",
												height: "40px",
											},
										}}
										color="info"
										size="large"
										onClick={handleSetting}
										startIcon={
											<SettingsIcon
												sx={{ fontSize: "10px" }}
											/>
										}
									>
										Settings
									</Button>
								</div>
							</div>
						</div>
					) : (
						<Game
							data={data}
							currentState={currentState}
							setCurrentState={setCurrentState}
							setIsGame={setIsGame}
						/>
					)}
				</div>
			)}
		</div>
	);
}
