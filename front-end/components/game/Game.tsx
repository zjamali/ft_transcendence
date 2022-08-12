import React, { useRef, useEffect, useState, useContext } from "react";
import { GameOver } from "./GameOver";
import { Data, StateGame, UserInGame } from "../../Library/Data";
import { drawGame } from "../../Library/DrawShapes";
import { GameObj } from "../../Library/gameObject";
import style from "../../styles/Game.module.css";
import socket from "../../Library/Socket";
import { Loading } from "@nextui-org/react";
import { data } from "./HomeGame";
import { AppContext } from "../../context/AppContext";
import { CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Image from "next/image";
import { useRouter } from "next/router";

interface GameProps {
	data: Data;
	currentState: StateGame;
	setCurrentState: (state: StateGame) => void;
	setIsGame?: (isGame: boolean) => void;
	gameContainer?: any;
}

export function Game(props: GameProps) {
	const { data, currentState, setCurrentState, setIsGame } = props;
	const { state } = useContext(AppContext);
	const router = useRouter();
	const canvasRef: any = useRef();
	const initialState: GameObj = {
		ball: {
			ball_x: data.get_Ball_X(),
			ball_y: data.get_Ball_Y(),
		},
		paddle: {
			paddle_left: data.get_PddleLeft_Y(),
			paddle_right: data.get_PddleRight_Y(),
		},
		score: {
			playerOne_Score: data.get_Score_One(),
			playerTwo_Score: data.get_Score_Two(),
		},
		watcher_count: data?.get_Watchers(),
		currentState: data?.get_State(),
		isWin: data.get_Winner(),
	};

	const [gameState, setGameState] = useState(initialState);

	const [changeData, setChangeData] = useState([
		data.get_Width(),
		data.get_Height(),
	]);

	function responseGame() {
		//
		// 	"game container : ",
		// 	props.gameContainer.current.clientWidth
		// );
		if (!props.gameContainer.current) return;
		const new_width = (props.gameContainer.current.clientWidth * 80) / 100;
		//
		data.set_Width(new_width);
		data.set_Height(new_width / 2);
		data.set_Trace_X(data.get_Width());
		data.set_Paddle_Height(data.get_Height());
		data.set_Right_Pddle_X(data.get_Width());

		data.set_PddleLeft_Y(
			data.get_Height() / 2 - data.get_Paddle_Height() / 2
		);
		data.set_PddleRight_Y(
			data.get_Height() / 2 - data.get_Paddle_Height() / 2
		);
		data.set_Ball_X(data.get_Width() / 2);
		data.set_Ball_Y(data.get_Height() / 2);

		if (
			data.get_TypeRes() !== 1 &&
			props.gameContainer.current.clientWidth > 1200
		) {
			data.set_Paddle_width(10);
			data.set_ball_Radius(10);
			data.set_borderHeight(15);
			data.set_TypeRes(1);
		} else if (
			data.get_TypeRes() !== 2 &&
			props.gameContainer.current.clientWidth > 800 &&
			props.gameContainer.current.clientWidth <= 1200
		) {
			data.set_Paddle_width(8);
			data.set_ball_Radius(8);
			data.set_borderHeight(10);
			data.set_TypeRes(2);
		} else if (
			data.get_TypeRes() !== 4 &&
			props.gameContainer.current.clientWidth <= 450
		) {
			data.set_Paddle_width(6);
			data.set_ball_Radius(6);
			data.set_borderHeight(5);
			data.set_TypeRes(0);
		}

		// }
		// if (data.get_TypeRes() !== 1 && window.innerWidth > 1200) {
		// 	data.set_Width(1200);
		// 	data.set_Height(600);
		// 	data.set_Trace_X(data.get_Width());
		// 	data.set_Paddle_Height(data.get_Height());
		// 	data.set_Paddle_width(10);
		// 	data.set_Right_Pddle_X(data.get_Width());
		// 	data.set_PddleLeft_Y(
		// 		data.get_Height() / 2 - data.get_Paddle_Height() / 2
		// 	);
		// 	data.set_PddleRight_Y(
		// 		data.get_Height() / 2 - data.get_Paddle_Height() / 2
		// 	);
		// 	data.set_Ball_X(data.get_Width() / 2);
		// 	data.set_Ball_Y(data.get_Height() / 2);
		// 	data.set_ball_Radius(10);
		// 	data.set_TypeRes(1);
		// 	data.set_borderHeight(15);
		// } else if (
		// 	data.get_TypeRes() !== 2 &&
		// 	window.innerWidth > 800 &&
		// 	window.innerWidth <= 1200
		// ) {
		// 	data.set_Width(900);
		// 	data.set_Height(450);
		// 	data.set_Trace_X(data.get_Width());
		// 	data.set_Paddle_Height(data.get_Height());
		// 	data.set_Paddle_width(8);
		// 	data.set_Right_Pddle_X(data.get_Width());
		// 	data.set_PddleLeft_Y(
		// 		data.get_Height() / 2 - data.get_Paddle_Height() / 2
		// 	);
		// 	data.set_PddleRight_Y(
		// 		data.get_Height() / 2 - data.get_Paddle_Height() / 2
		// 	);
		// 	data.set_Ball_X(data.get_Width() / 2);
		// 	data.set_Ball_Y(data.get_Height() / 2);
		// 	data.set_ball_Radius(8);
		// 	data.set_TypeRes(2);
		// 	data.set_borderHeight(10);
		// } else if (data.get_TypeRes() !== 4 && window.innerWidth <= 900) {
		// 	data.set_Width(450);
		// 	data.set_Height(225);
		// 	data.set_Trace_X(data.get_Width());
		// 	data.set_Paddle_Height(data.get_Height());
		// 	data.set_Paddle_width(6);
		// 	data.set_Right_Pddle_X(data.get_Width());
		// 	data.set_PddleLeft_Y(
		// 		data.get_Height() / 2 - data.get_Paddle_Height() / 2
		// 	);
		// 	data.set_PddleRight_Y(
		// 		data.get_Height() / 2 - data.get_Paddle_Height() / 2
		// 	);
		// 	data.set_Ball_X(data.get_Width() / 2);
		// 	data.set_Ball_Y(data.get_Height() / 2);
		// 	data.set_ball_Radius(6);
		// 	data.set_TypeRes(0);
		// 	data.set_borderHeight(5);
		// }
		setChangeData([data.get_Width(), data.get_Height()]);
	}
	useEffect(() => {
		//NOTE - Declare Variable "canvas" and Assign Reference from JSX
		const canvas: any = canvasRef.current;

		//NOTE - To get the canvas' 2D rendering context
		if (canvas !== undefined) {
			const context = canvas.getContext("2d");

			drawGame(context, data);
		}
	}, [changeData]);

	useEffect(() => {
		window.addEventListener("resize", responseGame);
	}, []);

	useEffect(() => {
		if (router.pathname == '/game')
			state.eventsSocket.emit("GAME_START", state.mainUser.id);
	}, [router]);

	useEffect(() => {
		//NOTE - Declare Variable "canvas" and Assign Reference from JSX
		const canvas: any = canvasRef.current;
		if (canvas !== undefined) {
			//NOTE - To get the canvas' 2D rendering context
			const context = canvas.getContext("2d");

			///new_x 😦 old_x / old_width ) * new_width;
			//
			const new_x = (gameState.ball.ball_x / 1200) * canvas.clientWidth;
			const new_y = (gameState.ball.ball_y / 600) * canvas.clientHeight;
			data.set_Ball_X(new_x);
			data.set_Ball_Y(new_y);
			// data.set_ball_Radius(6);
			// data.set_Paddle_width(6);
			//NOTE - Movement Paddles
			const new_paddle_leftY =
				(canvas.clientHeight * gameState.paddle.paddle_left) / 600;
			const new_paddle_rightY =
				(canvas.clientHeight * gameState.paddle.paddle_right) / 600;
			data.set_PddleLeft_Y(new_paddle_leftY);
			data.set_PddleRight_Y(new_paddle_rightY);
			// data.set_borderHeight(canvas.clientWidth/1000);

			// if (data.get_TypeRes() !== 1 && props.gameContainer.current.clientWidth > 800) {
			// 	data.set_Paddle_width(10);
			// 	data.set_ball_Radius(10);
			// 	data.set_borderHeight(15);
			// 	data.set_TypeRes(1);
			// }
			// else if (data.get_TypeRes() !== 2 && props.gameContainer.current.clientWidth > 500 && props.gameContainer.current.clientWidth <= 800) {
			// 	data.set_Paddle_width(8);
			// 	data.set_ball_Radius(8);
			// 	data.set_borderHeight(10);
			// 	data.set_TypeRes(2);
			// }
			// else if (data.get_TypeRes() !== 4 && props.gameContainer.current.clientWidth <= 500) {
			// 	data.set_Paddle_width(6);
			// 	data.set_ball_Radius(6);
			// 	data.set_borderHeight(5);
			// 	data.set_TypeRes(0);
			// }

			//NOTE - Movement Ball
			// if (data.get_Width() <= 450) {
			// 	// new_x 😦 old_x / old_width ) * new_width;
			// 	const new_x = (gameState.ball.ball_x / 1200) * 450;
			// 	const new_y = (gameState.ball.ball_y / 600) * 225;
			// 	data.set_Ball_X(new_x);
			// 	data.set_Ball_Y(new_y);
			// 	data.set_ball_Radius(6);
			// 	data.set_Paddle_width(6);
			// 	//NOTE - Movement Paddles
			// 	const new_paddle_leftY =
			// 		(225 * gameState.paddle.paddle_left) / 600;
			// 	const new_paddle_rightY =
			// 		(225 * gameState.paddle.paddle_right) / 600;
			// 	data.set_PddleLeft_Y(new_paddle_leftY);
			// 	data.set_PddleRight_Y(new_paddle_rightY);
			// 	data.set_borderHeight(5);
			// } else if (data.get_Width() <= 900) {
			// 	const new_x = (gameState.ball.ball_x / 1200) * 900;
			// 	const new_y = (gameState.ball.ball_y / 600) * 450;
			// 	data.set_Ball_X(new_x);
			// 	data.set_Ball_Y(new_y);
			// 	data.set_ball_Radius(8);
			// 	data.set_Paddle_width(8);
			// 	//NOTE - Movement Paddles
			// 	const new_paddle_leftY =
			// 		(450 * gameState.paddle.paddle_left) / 600;
			// 	const new_paddle_rightY =
			// 		(450 * gameState.paddle.paddle_right) / 600;
			// 	data.set_PddleLeft_Y(new_paddle_leftY);
			// 	data.set_PddleRight_Y(new_paddle_rightY);
			// 	data.set_borderHeight(10);
			// } else {
			// 	data.set_Ball_X(gameState.ball.ball_x);
			// 	data.set_Ball_Y(gameState.ball.ball_y);
			// 	data.set_ball_Radius(10);
			// 	data.set_Paddle_width(10);
			// 	//NOTE - Movement Paddles
			// 	data.set_PddleLeft_Y(gameState.paddle.paddle_left);
			// 	data.set_PddleRight_Y(gameState.paddle.paddle_right);
			// 	data.set_borderHeight(15);
			// }

			//NOTE - Update Scores
			data.set_Score_One(gameState.score.playerOne_Score);
			data.set_Score_Two(gameState.score.playerTwo_Score);

			//NOTE - Update Watchers
			data.set_Watchers(gameState.watcher_count);

			//NOTE - Update State Game if Wait OR Play OR Over
			data.set_State(gameState.currentState);

			//NOTE - Update Win OR Lose
			data.set_Winner(gameState.isWin);

			//NOTE - Display Game
			drawGame(context, data);

			//NOTE - Check State Game if true Display "Game Over"
			if (data.get_State() === StateGame.OVER) {
				setCurrentState(StateGame.OVER);
			}

			socket.on("gameState", (newState: any) => {
				setGameState(newState);
			});
		}

		return () => {
			socket.off("gameState");
		};
	}, [gameState, currentState]);

	useEffect(() => {
		//NOTE - the document is undefined. I should be able to use it inside useEffect
		document.addEventListener("keydown", (e) => {
			if (e.code === "ArrowUp") {
				socket.emit("upPaddle", "down");
			} else if (e.code === "ArrowDown") {
				socket.emit("downPaddle", "down");
			}
		});
		document.addEventListener("keyup", (e) => {
			if (e.code === "ArrowUp") {
				socket.emit("upPaddle", "up");
			} else if (e.code === "ArrowDown") {
				socket.emit("downPaddle", "up");
			}
		});

		responseGame();

		return () => {
			socket.off("upPaddle");
			socket.off("downPaddle");
		};
	}, []);

	return (
		<div style={{ width: "100%", height: "100%" }}>
			{currentState === StateGame.WAIT ? (
				<div
					className="game-loading"
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<h1
						className="loading-header"
						style={{
							fontFamily: "Deltha, sans-serif",
							position: "relative",
							bottom: "10px",
						}}
					>
						LOADING
					</h1>
					<CircularProgress color="inherit" />
				</div>
			) : (
				<div
					className={style.container}
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{/* <div className={style.info}>
						<h1>Players: &uarr; &darr;</h1>
					</div> */}
					<canvas
						className={style.myCanvas}
						width={data.get_Width()}
						height={data.get_Height()}
						ref={canvasRef}
					></canvas>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							width: "90%",
						}}
					>
						<div className="score-game-live">
							<div className="game-player">
								<Image
									loader={() => data.get_userOne().avatar}
									unoptimized={true}
									src={data.get_userOne().avatar}
									alt="user avatar"
									layout="fill"
								/>
							</div>
							<div className="game-player-username">
								{data.get_userOne().username}
							</div>
						</div>
						<div className="score-game-live">
							<VisibilityIcon sx={{ fontSize: "30px" }} />
							<div className="game-player-username">
								{gameState.watcher_count}
							</div>
						</div>
						<div className="score-game-live">
							<div className="game-player-username">
								{data.get_userTwo().username}
							</div>
							<div className="game-player">
								<Image
									loader={() => data.get_userTwo().avatar}
									unoptimized={true}
									src={data.get_userTwo().avatar}
									alt="user avatar"
									layout="fill"
								/>
							</div>
						</div>
					</div>
					{/* <div className={style.users}>
						<div>
							<img
								src={data.get_userOne().avatar}
								alt="User_One"
							/>
							<span>{data.get_userOne().username}</span>
						</div>
						<div className={style.watcher}>
							<h2>WATCHERS</h2>
							<span>{gameState.watcher_count}</span>
						</div>
						<div>
							<img
								src={data.get_userTwo().avatar}
								alt="User_Two"
							/>
							{data.get_userTwo().username}
						</div>
					</div> */}
				</div>
			)}
			{(currentState === StateGame.OVER)  && (
				<GameOver
					data={data}
					setIsGame={setIsGame}
					setCurrentState={setCurrentState}
				/>
			)}
		</div>
	);
}

export default Game;
