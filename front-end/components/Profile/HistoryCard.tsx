import Image from "next/image";
// import img from "../../public/abstract.jpeg"
import { Button } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import { AppContext } from "../../context/AppContext";
import { useContext, useEffect } from "react";

const HistoryCard = ({ match }: {match : any}) => {
	// const { state } = useContext(AppContext);
	const mainUserImage = match.firstPlayerImage;
	const img = match.secondPlayerImage;
	useEffect(()=> {
		console.log("mtch card : ", match)
	})
	return (
		<div
			style={{ margin: "0", padding: "0", width: "90%", height: "100%" }}
		>
			<div className="history-card">
				<div className="admin-card">
					<div className="history-card-img">
						<Image
							loader={() => match.firstPlayerImage}
							unoptimized={true}
							src={match.firstPlayerImage}
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
							{match.firstPlayerUserName}
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
							{match.scoreSecond} vs {match.scoreFirst}
						</Button>
					</h4>
				</div>
				<div className="opponent-card">
					<div className="history-card-img">
					<Image
							loader={() => match.secondPlayerImage}
							unoptimized={true}
							src={match.secondPlayerImage}
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
							{match.secondPlayerUserName}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HistoryCard;
