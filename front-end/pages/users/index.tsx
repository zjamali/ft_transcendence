import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Profile/Header";
import SideBar from "../../components/Profile/SideBar";
import Image from "next/image";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { User } from "../../utils/interfaces";
import Router, { useRouter } from "next/router";
import { Button, Divider } from "@mui/material"
import FriendsList from "../../components/Profile/FriendsList";
import Link from "next/link";
import NoiseControlOffIcon from "@mui/icons-material/NoiseControlOff";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CircleIcon from "@mui/icons-material/Circle";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PersonAddIcon from '@mui/icons-material/PersonAdd'



const Users = () => {
	const { state, setMainUser, friends, setFriends } = useContext(AppContext);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const [friendsIds, setFriendsIds] = useState<any[] | null>(null);
	
		
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
				setAllUsers([...allUsersList].sort((a, b) => Number(a.id) -Number(b.id)));
			} else fetchAllUsers();
		} else fetchAllUsers();
	}

	useEffect(() => {
		axios
			.get("http://localhost:5000/users/me", { withCredentials: true })
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
		state.eventsSocket.current.on("A_USER_STATUS_UPDATED", (user: any) => {
			console.log("user status updated");
			setUsersStatus(user.isOnline, user);})
			fetchAllUsers();
			fetchFriends();
	}, [])
	
	function fetchAllUsers() {
		axios
			.get("http://localhost:5000/users", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					console.log("all users", res.data)
					setAllUsers([...res.data].sort((a, b) => Number(a.id) -Number(b.id)));
				}
			})
			.catch(() => {
				console.log("cant get user");
			});
	}
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
					console.log('all friends :', res.data)
					console.log("---all users", allUsers)
					console.log("test ------- ", allUsers.includes(res.data[0]))
					setFriends([...res.data]);
					setFriendsIds([...res.data].map((user)=>  user.id));
					// console.log()
				});
		} catch {
			console.log("CANT GET ALL USERS");
		}
	}
	return (
		<>
			{state.mainUser && (
				// <div>
				// 	<Header />
				// 	<div className="profile-container" style={{	alignItems: "center", justifyContent: "center"}}>
				// 		<SideBar />
						<div className="profile-content ">
							<div className="profile-data" style={{paddingLeft: '10px', border: "0.4px solid #919eab", width: '80%', maxWidth: '1700px'}}>
								<div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px',}}>
									<h1 style={{marginBottom: '2px',marginTop: '-15px' ,fontWeight: '300'}}>Users</h1>
									<hr style={{marginTop: "-2px", marginBottom: '20px', width: '90px', height: '0.1px', color: '#555f6a'}}/>
									{/* <Divider sx={{color: 'white'}} variant="inset"/> */}
									{/* <hr/> */}
									<div style={{display: 'flex', flexDirection: 'row', alignContent: 'stretch', justifyContent: 'left',flexWrap:'wrap', gap: '15px'}}>
										{allUsers &&
											allUsers.map((user) => {
												const src:string = user.image
												const setStateOffFriend = (active: number) => {
													switch (active) {
														case 1:
															return (
																<Button
																	variant="outlined"
																	size="small"
																	color="warning"
																	startIcon={<SportsEsportsIcon sx={{}}/>}
																	sx={{ width: 90 , marginRight: 1, fontSize: 11}}
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
																	startIcon={<CircleIcon sx={{width: 10, fontSize: 2}}/>}
																	sx={{marginRight: 1, fontSize: 11}}
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
																	startIcon={<NoiseControlOffIcon  sx={{}}/>}
																	sx={{ width: 90,marginRight: 1, fontSize: 11 }}
																>
																	{" "}
																	Offline
																</Button>
															);
													}
												};
												if (user?.id !== state?.mainUser.id)
												{
													return (
														<Link href={{pathname: 'users/[userId]',query: { userId: `${user.id}`}}} key={user.id}>
															<div className="wall-friend-card" key={user.id}>
																<div style={{position: "relative", width: '85px', height: '85px', borderRadius: '50px', overflow: 'hidden'}}>
																	<Image loader={() => src} unoptimized={true} src={src} alt="user avatar" layout="fill"/>
																</div>
																<div style={{marginBottom: '25px', color: '#919eab'}}>
																	{user.userName}
																</div>
																<div>
																	{
																		setStateOffFriend(
																			user.isPlaying
																				? 1
																				: user.isOnline
																				? 2
																				: 3)
																	}
																	{
																		(friendsIds?.includes(user.id))? 
																			<Button variant="outlined" size="small" color="error" sx={{width: 95}}startIcon={<PersonRemoveIcon sx={{width: 14}}/>} onClick={()=>{alert("si")}}>Unfriend</Button> :
																			<Button variant="outlined" size="small" color="primary" sx={{fontSize: 11}} startIcon={<PersonAddIcon sx={{width: 14}}/>}onClick={()=> {alert('sisi')}}>Add friend</Button>
																	}
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
				// 	</div>
				// </div>
			)}
		</>
	);
};

export default Users;