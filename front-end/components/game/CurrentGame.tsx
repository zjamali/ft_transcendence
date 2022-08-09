import { useEffect, useState } from "react";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import socket from "../../Library/Socket";
import Game from "./Game";
import { data } from "./HomeGame";
import Image from "next/image";
import { Button } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useRouter } from "next/router";

//NOTE - Initiale data and Information about all Game like (ball, paddle, score, width, height, canvas)
// let data: Data;
// if (socket.io.opts.query) data = socket.io.opts.query.data;

function CurrentGame(props: any) {
	const router = useRouter();
	const [check, setCheck] = useState(false);
	useEffect(() => {
		console.log("router : ", router);
		if (router.pathname === '/live/[liveId]') {
			setCheck(true);
		} else {
			setCheck(false);
		}
	}, [router]);
	
	const hundlGame = () => {
		data.set_userOne(props.game.player_1);
		data.set_userTwo(props.game.player_2);
		socket.emit("watchers", props.game);
		setCheck(true);
		// router.push(`/live?gameWatch=${props.index}`);
	};

	return (
		<div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			{!check ? (
				<div className="history-card" style={{width: '90%'}} onClick={() => hundlGame()}>
					<div className="admin-card">
						<div className="history-card-img">
							<Image
								loader={() => props.game.player_1.avatar}
								unoptimized={true}
								src={props.game.player_1.avatar}
								alt="img-user"
								layout="fill"
							/>
						</div>
						<div className="friends-card-name">
							<p
								style={{
									fontSize: "13px",
									textAlign: "center",
									lineHeight: "20px",
								}}
							>
								{props.game.player_1.username}
							</p>
						</div>
					</div>
					<div className="score-card">
						<h4>
							<Button
								variant="outlined"
								size="medium"
								sx={{
									"&::before": {
										content: `"Score"`,
										fontWeight: "400",
										fontSize: "12px",
										color: "#10AA88",
										position: "relative",
										bottom: "26px",
										left: "32px",
										width: 0,
									},
									// width: '150px',
									color: "#109688",
									borderColor: "#109688",
									"&:hover": {
										borderColor: "#10AA88",
										color: "#10AA88",
									},
								}}
								startIcon={<VideogameAssetIcon />}
								endIcon={<VideogameAssetIcon />}
							>
								{props.game.player_2.score} vs{" "}
								{props.game.player_1.score}
							</Button>
						</h4>
					</div>
					<div className="opponent-card">
						<div className="history-card-img">
							<Image
								loader={() => props.game.player_2.avatar}
								unoptimized={true}
								src={props.game.player_2.avatar}
								alt="img-user"
								layout="fill"
							/>
						</div>
						<div className="friends-card-name">
							<p
								style={{
									fontSize: "13px",
									textAlign: "center",
									lineHeight: "20px",
								}}
							>
								{props.game.player_2.username}
							</p>
						</div>
					</div>
				</div>
			) : (
				<Game data={data} gameContainer={props.gameContainer} />
			)}
		</div>
	);
}

export default CurrentGame;
