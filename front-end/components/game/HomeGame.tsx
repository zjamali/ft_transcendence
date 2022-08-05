import { useContext, useEffect, useState } from "react";
import styles from "../../styles/HomeGame.module.css";
import Game from "./Game";
import Cookies from "js-cookie";
import socket from "../../Library/Socket";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Setting from "./Setting";
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, ButtonBase } from "@mui/material";
import SportsEsportsTwoToneIcon from '@mui/icons-material/SportsEsportsTwoTone';

import { Data } from "../../Library/Data";
import { eventsSocket } from "../../context/sockets";

//NOTE - Initiale data and Information about all Game like (ball, paddle, score, width, height, canvas)
export let data = new Data(1200, 600);

export function HomeGame() {
	const [isGame, setIsGame] = useState(false);
	const [isSetting, setSetting] = useState(true);
	const [currentState, setCurrentState] = useState(data.get_State());
	const { state } = useContext(AppContext);

	const [accepGame, setAccepGame] = useState(false);
	const handleGame = async () => {
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

						data.set_State(1);
					}
					setCurrentState(1);
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
		<div style={{ height: 'calc(100vh - 430px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#212b36', position: 'relative', top: '50px', border: '1px solid #555f6a', borderRadius: '12px'}}>
			{!isSetting && <Setting setSetting={setSetting} data={data} />}
				<div className="home-game-content" >
					<div style={{color: '#919eab', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><h1 style={{fontFamily: 'Deltha, sans-serif', fontWeight: '900', fontSize: '70px', position: 'relative', bottom: '50px'}}>Ping Pong Game</h1></div>
				{!isGame ? 
					(
						<div style={{height: '85%', display: 'flex', flexDirection: 'row'}}>
							<div style={{width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
								<div style={{width: '100%', height: '100%'}}><img src="/pingpong.png" alt="Ping Pong Game" style={{ width: '100%', height: '100%', objectFit: 'fill'}}/></div>
							</div>
							<div style={{width: '50%', height: '100%', borderLeft: '0.1px solid #919eab', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', fontSize: '20px', padding: '15px', flexDirection: 'column'}}>
								<div style={{width: '100%', marginLeft: '50px', color: '#555f6a', lineHeight: '30px', fontFamily: 'Deltha, sans-serif'}}>
									PING PONG is a table tennis game where you can enjoy a real match experience.
									<br />
									You can enjoy the feeling of an actual table tennis by tossing
									and serving the ball, and hitting back to a different direction
									by adjusting the angle of the racket.
									<br />
									You can discorver it by yourself &nbsp;
								</div>
								<div style={{width: '100%', height: '60px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
									<Button variant="outlined" color="warning" size="large" onClick={handleGame} startIcon={<SportsEsportsTwoToneIcon/>}>Play now</Button>
									<Button variant="outlined" color="info" size="large" onClick={handleSetting}startIcon={<SettingsIcon/>}>Settings</Button>
								</div>
							</div>
						</div>
					)
					: 
					(<Game data={data} currentState={currentState} setCurrentState={setCurrentState} />)
				}
			</div>
		</div>
	)
}
