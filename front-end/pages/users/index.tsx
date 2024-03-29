import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { User } from "../../utils/interfaces";
import Router, { useRouter } from "next/router";
import { Button, Divider } from "@mui/material";
import FriendsList from "../../components/Profile/FriendsList";
import Link from "next/link";
import NoiseControlOffIcon from "@mui/icons-material/NoiseControlOff";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CircleIcon from "@mui/icons-material/Circle";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { addFriend, unfriend } from "../../utils/utils";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Users = () => {
	const { state, setMainUser, friends, setFriends } = useContext(AppContext);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const [friendsIds, setFriendsIds] = useState<any[] | null>(null);
	const [pendingIds, setPendingIds] = useState<any[]>([]);

	const router = useRouter();

	function setUsersStatus(status: boolean, user: any) {
		if (allUsers) {
			let allUsersList = [...allUsers];
			if (
				allUsersList.filter((friend) => {
					friend.id === user.id;
				}).length === 1
			) {
				allUsersList.map((user) => {
					if (user.id === user.id) {
						user.isOnline = status;
					}
				});
				setAllUsers(
					[...allUsersList].sort(
						(a, b) => Number(a.id) - Number(b.id)
					)
				);
			} else fetchAllUsers();
		} else fetchAllUsers();
	}

	useEffect(() => {
		axios
			.get(`${process.env.SERVER_HOST}/users/me`, {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status === 200) {
					setMainUser({ ...res.data });
				}
				fetchAllUsers();
			})
			.catch(() => {
				Router.push("/");
			});
	}, []);

	useEffect(() => {
		fetchAllUsers();
		fetchFriends();
		fetchSentRequest();
		state.eventsSocket.on("A_USER_STATUS_UPDATED", (user: any) => {
			setUsersStatus(user.isOnline, user);
		});
		state.eventsSocket.on("UPDATE_DATA", (user: any) => {
			fetchAllUsers();
			fetchFriends();
			console.log("update data");
			fetchSentRequest();
		});

		return () => {
			state.eventsSocket.off("A_USER_STATUS_UPDATED");
			state.eventsSocket.off("A_PROFILE_UPDATE");
		};
	}, []);

	function fetchAllUsers() {
		axios
			.get(`${process.env.SERVER_HOST}/users`, { withCredentials: true })
			.then(async (res) => {
				if (res.status === 200) {
					//
					const blockedby = await fetchUsersBlockedBy();
					if ([...blockedby.data].length === 0) {
						setAllUsers(
							[...res.data].sort(
								(a, b) => Number(a.id) - Number(b.id)
							)
						);
					} else {
						let filtredUsers: User[] = [];
						[...blockedby.data].forEach((BlockedByuser) => {
							[...res.data].forEach((user) => {
								if (BlockedByuser.id != user.id) {
									filtredUsers.push(user);
								}
							});
						});
						setAllUsers(
							[...filtredUsers].sort(
								(a, b) => Number(a.id) - Number(b.id)
							)
						);
					}
					fetchSentRequest();
				}
			})
			.catch(() => {});
	}
	async function fetchUsersBlockedBy() {
		return await axios.get(
			`${process.env.SERVER_HOST}/users/blockedByUsers`,
			{
				withCredentials: true,
			}
		);
	}
	async function fetchFriends() {
		try {
			axios
				.get(
					`${process.env.SERVER_HOST}/users/id/${state.mainUser.id}/friends`,
					{
						withCredentials: true,
					}
				)
				.then((res) => {
					setFriends([...res.data]);
					setFriendsIds([...res.data].map((user) => user.id));
				});
		} catch {}
	}
	const fetchSentRequest = async () => {
		axios
			.get(`${process.env.SERVER_HOST}/users/sentrequests`, {
				withCredentials: true,
			})
			.then((responce) => {
				if ([...responce.data].length)
					setPendingIds([...responce.data].map((user) => user.id));
				else setPendingIds([]);
			});
	};
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};
	return (
		<>
			{state.mainUser && (
				<div className="profile-content ">
					<div
						className="profile-data"
						style={{
							paddingLeft: "10px",
							border: "0.4px solid #919eab",
							width: "80%",
							maxWidth: "1700px",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "10px",
								marginTop: "30px",
							}}
						>
							<h1
								style={{
									marginBottom: "2px",
									marginTop: "-15px",
									fontWeight: "300",
								}}
							>
								Users
							</h1>
							<hr
								style={{
									marginTop: "-2px",
									marginBottom: "20px",
									width: "90px",
									height: "0.1px",
									color: "#555f6a",
								}}
							/>
							{/* <Divider sx={{color: 'white'}} variant="inset"/> */}
							{/* <hr/> */}
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "left",
									alignItems: "flex-start",
									flexWrap: "wrap",
									gap: "15px",
								}}
							>
								{allUsers &&
									allUsers.map((user) => {
										const src: string = user.image;
										const setStateOffFriend = (
											active: number
										) => {
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
																fontSize: 9.5,
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
										if (user?.id !== state?.mainUser.id) {
											return (
												<Link
													href={{
														pathname:
															"users/[userId]",
														query: {
															userId: `${user.id}`,
														},
													}}
													key={user.id}
												>
													<div
														className="wall-friend-card"
														key={user.id}
													>
														<div
															style={{
																position:
																	"relative",
																width: "85px",
																height: "85px",
																borderRadius:
																	"50px",
																overflow:
																	"hidden",
															}}
														>
															<Image
																loader={() =>
																	src
																}
																unoptimized={
																	true
																}
																src={src}
																alt="user avatar"
																layout="fill"
															/>
														</div>
														<div
															style={{
																marginBottom:
																	"25px",
																color:
																	"#919eab",
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
															{friendsIds?.includes(
																user.id
															) ? (
																<Button
																	variant="outlined"
																	size="small"
																	color="error"
																	sx={{
																		width: 95,
																	}}
																	startIcon={
																		<PersonRemoveIcon
																			sx={{
																				width: 14,
																			}}
																		/>
																	}
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		unfriend(
																			state
																				.mainUser
																				.id,
																			user.id
																		);
																	}}
																>
																	Unfriend
																</Button>
															) : pendingIds?.includes(
																	user.id
															  ) ? (
																<Button
																	variant="outlined"
																	color="primary"
																	size="small"
																	sx={{
																		fontSize: 11,
																	}}
																	startIcon={
																		<AutorenewIcon />
																	}
																>
																	PENDING
																</Button>
															) : (
																<Button
																	variant="outlined"
																	size="small"
																	color="primary"
																	sx={{
																		fontSize: 11,
																	}}
																	startIcon={
																		<PersonAddIcon
																			sx={{
																				width: 14,
																			}}
																		/>
																	}
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		addFriend(
																			state
																				.mainUser
																				.id,
																			user.id
																		);
																	}}
																>
																	Add friend
																</Button>
															)}
														</div>
													</div>
												</Link>
											);
										}
									})}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Users;
