import { Button } from "@mui/material"
import Image from "next/image"
import img from "../../public/abstract.jpeg"
import NoiseControlOffIcon from '@mui/icons-material/NoiseControlOff';
import HideSourceIcon from '@mui/icons-material/HideSource';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CircleIcon from '@mui/icons-material/Circle';
import ChatContacts from "../chat/chatContacts";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/chatContext";






const FriendsCard = () => {
	async function fetchFriends() {
		try {
			axios
			.get(`http://localhost:5000/users/id/${state.mainUser.id}/friends`, {
				withCredentials: true,
			})
			.then((res) => {
				// console.log('all users :', res.data)
				setFriends([...res.data]);
			})
		} catch {
			console.log('CANT GET ALL USERS')
		}
	}
	useEffect(() => {
		fetchFriends();
	}, [])
	
	const [friends, setFriends] = useState<[] | null>(null);
	const {state} = useContext(ChatContext);
	console.log(friends)
	return (
		<div style={{margin:"0", padding:"0", width:"90%", height:"100%"}}>
			{
				friends && friends.map( (friend:any) => {
					const setStateOffFriend = (active: number) => {
						switch (active) {
						case 1:
							return <Button variant="outlined" size="small" color="warning" startIcon={<SportsEsportsIcon/>} sx={{width: 100}}> In game</Button>
						case 2:
							return <Button variant="outlined" size="small" color="success" startIcon={<CircleIcon/>} sx={{width: 100}}> Online</Button>
						case 3:
								return <Button variant="outlined" size="small" color="error" startIcon={<NoiseControlOffIcon/>} sx={{width: 100}}> Offline</Button>
						}
					}
					const fuserName: string = friend.userName
					const fimage: string = friend.image
					return ( 
						<div className="friends-card" key={friend.id} >
							<div className="friends-card-img-name">
								<div className="friends-card-img">
									<Image loader={()=>fimage} src={fimage} unoptimized={true} alt="img-user" layout="fill"/>
								</div>
								<div style={{fontSize:"18px", fontWeight: "250"}}>{fuserName}</div>
							</div>
							<div className="friends-card-state">
								{
									setStateOffFriend(friend.isPlaying ?  1 : friend.isOnline ? 2 : 3)
								}
							</div>
						</div>
					)
				})
			}
		</div>
	)
}

export default FriendsCard