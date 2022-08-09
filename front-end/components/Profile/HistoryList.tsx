import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import HistoryCard from "./HistoryCard";

const HistoryList = (props: any) => {
	const [matches, setMatches] = useState<any[]>([]);
	const { state } = useContext(AppContext);
	const [lose, setLose] = useState(0);
	const [win, setWin] = useState(0);
	useEffect(() => {
		console.log("matches history : ");
		fetchMatchs();
		state.eventsSocket.on("UPDATE_DATA", () => {
			fetchMatchs();
		});
	}, []);

	async function fetchMatchs() {
		console.log("fetch matches ::->");
		try {
			axios
				.get(`${process.env.SERVER_HOST}/users/${props.id}/MatchesHistory`, {
					withCredentials: true,
				})
				.then((res) => {
					// setFriendsIds([...res.data].map((user)=>  user.id));
					console.log("matchs : ", res);
					setMatches(res.data);
					///
					let winScore = 0;
					let loseScore = 0;
					console.log("all matches : ", res.data);
					[...res.data]?.forEach((match) => {
						if (match) {
							if (match.scoreFirst > match.scoreSecond) {
								if (match.firstPlayer === props.id)
									winScore += 1;
								else loseScore += 1;
							} else {
								if (match.secondPlayer === props.id)
									winScore += 1;
								else {
									loseScore += 1;
								}
							}
						}
					});
					setWin(winScore);
					setLose(loseScore);
					///
				});
		} catch {
			console.log("CANT GET ALL matches ");
		}
	}

	return (
		<div
			className="profile-data"
			style={{
				flexDirection: "column",
				justifyContent: "flex-start",
				gap: "20px",
			}}
		>
			<div className="profile-data-row1" style={{ width: "100%" }}>
				<div className="statics-header">
					<h4>Game Statics</h4>
				</div>
				<div className="statics-games">
					<div className="statics-win">
						<h3 className="h3-statics">
							{lose > 100 ? "+100" : lose}
						</h3>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								gap: "10px",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<p>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="23"
									height="23"
									fill="#919eab"
									viewBox="0 0 16 16"
								>
									<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
									<path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
								</svg>
							</p>
							<p className="p-statics">Lost</p>
						</div>
					</div>
					<hr className="hr-line" />
					<div className="statics-loss">
						<h3 className="h3-statics">
							{win > 100 ? "+100" : win}
						</h3>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								gap: "10px",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<p>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="23.5"
									height="23.5"
									fill="#919eab"
									viewBox="0 0 16 16"
								>
									<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
									<path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
								</svg>
							</p>
							<p className="p-statics">Won</p>
						</div>
					</div>
				</div>
			</div>
			<div className="friends-label" style={{ height: "65%" }}>
				<div className="friends-label-header">
					<h4>Match History</h4>
				</div>
				<div className="list-of-friends">
					{matches?.map((match) => {
						// console.log("matches ::: ", match);
						return (
							<HistoryCard match={{ ...match }} key={match.id} />
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default HistoryList;
