import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { User } from "../../utils/interfaces";
import Router, { useRouter } from "next/router";
import { Button, Divider } from "@mui/material";
import Link from "next/link";
import NoiseControlOffIcon from "@mui/icons-material/NoiseControlOff";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CircleIcon from "@mui/icons-material/Circle";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const FriendsList = () => {
	const { state, setMainUser, setFriends } = useContext(AppContext);
	// const [friendsIds, setFriendsIds] = useState<any[] | null>(null);

	useEffect(() => {
		state.eventsSocket.on("UPDATE_DATA", () => {
			fetchFriends();
		});
		fetchFriends();

		return () => {
			state.eventsSocket.off("UPDATE_DATA");
		};
	}, []);

	async function fetchFriends() {
		try {
			axios
				.get(
					`http://localhost:5000/users/id/${state.mainUser.id}/friends`,
					{
						withCredentials: true,
					}
				)
				.then((res) => {
					setFriends([...res.data]);
					// setFriendsIds([...res.data].map((user)=>  user.id));
					// console.log()
				});
		} catch {
			console.log("CANT GET ALL USERS");
		}
	}

	return (
		<div className="profile-data" style={{}}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					marginTop: "30px",
				}}
			>
				<h2 style={{ marginBottom: "25px", fontWeight: "300" }}>
					Friends
				</h2>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignContent: "stretch",
						justifyContent: "left",
						flexWrap: "wrap",
						gap: "15px",
					}}
				>
					{state.friends &&
						state.friends.map((user: any) => {
							const src: string = user.image;
							const setStateOffFriend = (active: number) => {
								switch (active) {
									case 1:
										return (
											<Button
												variant="outlined"
												size="small"
												color="warning"
												startIcon={
													<SportsEsportsIcon
														sx={{}}
													/>
												}
												sx={{
													width: 90,
													marginRight: 1,
													fontSize: 11,
												}}
											>
												{" "}
												In game
											</Button>
										);
									case 2:
										return (
											<Button
												variant="outlined"
												size="small"
												color="success"
												startIcon={
													<CircleIcon
														sx={{
															width: 10,
															fontSize: 2,
														}}
													/>
												}
												sx={{
													marginRight: 1,
													fontSize: 11,
												}}
											>
												{" "}
												Online
											</Button>
										);
									case 3:
										return (
											<Button
												variant="outlined"
												size="small"
												color="error"
												startIcon={
													<NoiseControlOffIcon
														sx={{}}
													/>
												}
												sx={{
													width: 90,
													marginRight: 1,
													fontSize: 11,
												}}
											>
												{" "}
												Offline
											</Button>
										);
								}
							};
							return (
								<Link
									href={{
										pathname: "users/[userId]",
										query: { userId: `${user.id}` },
									}}
									key={user.id}
								>
									<div
										className="wall-friend-card"
										key={user.id}
									>
										<div
											style={{
												position: "relative",
												width: "85px",
												height: "85px",
												borderRadius: "50px",
												overflow: "hidden",
											}}
										>
											<Image
												loader={() => src}
												unoptimized={true}
												src={src}
												alt="user avatar"
												layout="fill"
											/>
										</div>
										<div
											style={{
												marginBottom: "25px",
												color: "#919eab",
											}}
										>
											{user.userName}
										</div>
										<div>
											{setStateOffFriend(
												user.isPlaying
													? 1
													: user.isOnline
													? 2
													: 3
											)}
											<Button
												variant="outlined"
												size="small"
												color="error"
												sx={{ width: 95, fontSize: 11 }}
												startIcon={
													<PersonRemoveIcon
														sx={{ width: 14 }}
													/>
												}
												onClick={() => {
													alert("si");
												}}
											>
												Unfriend
											</Button>
										</div>
									</div>
								</Link>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default FriendsList;
