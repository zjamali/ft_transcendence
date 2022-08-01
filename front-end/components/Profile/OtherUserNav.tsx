// import Image from 'next/image'
// import Header from './Header'
// import SideBar from './SideBar'
// import intra from '../../public/42.jpg'
// import DefaultData from './DefaultData'
// import EditModal from './EditModal'
import { useContext, useState,useEffect, ReactNode } from 'react'
import { Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { AppContext } from '../../context/AppContext'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { addFriend, unfriend } from '../../utils/utils'
import axios from 'axios'

interface OtherUserNav {
	userName: string,
	id: string,
	props?: ReactNode
}
const OtherUserNav: React.FC<OtherUserNav> = (props) => {
	console.log(props.userName)
	const {state , setFriends} = useContext(AppContext);
	const [isFriend, setIsFriend] = useState(false);

	useEffect(()=> {
		fetchFriends();
	})
	

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
					console.log("other : ", res.data);
					[...res.data].map((friend : any) =>{
						
						console.log("zabi", friend.userName, props.userName);
						if (friend.userName === props.userName)
						{
							setIsFriend(true);
							console.log("is friend");
							return;
						}
					})
				});
		} catch {
			console.log(" other CANT GET ALL USERS");
		}
	}
	return (
		<div className="profile-wall-nav">
			<div style={{ fontWeight: '400', color: 'white' }}>{props.userName}</div>
			<div>
				<Button
					variant="outlined"
					color="error"
					size="small"
					sx={{
						fontSize: 15,
						fontWeight: 300,
						textTransform: 'none',
						marginRight: 1,
						width: 110
					}}
					startIcon={<RemoveCircleIcon />}
					>
					Block
				</Button>
			</div>
			<div className="add-or-remove">
				{ !isFriend ? (
					<Button
					variant="outlined"
					color="primary"
					size="small"
					sx={{
						fontSize: 15,
						fontWeight: 300,
						textTransform: 'none',
						marginRight: 1,
						// '& @media (max-width:300px)': {
						// 	fontSize: 10,
						// },
					}}
					startIcon={<PersonAddIcon />}
					onClick={(e)=> {e.preventDefault(); addFriend(state.mainUser.id,props.id)}}
					>
					Add Friend
					</Button>
				) : (
					<Button
					variant="outlined"
					color="error"
					size="small"
					sx={{
						fontSize: 15,
						fontWeight: 300,
						textTransform: 'none',
						marginRight: 1,
					}}
					startIcon={<PersonRemoveIcon />}
					onClick={(e)=> {e.preventDefault(); unfriend(props.id)}}
					>
					Unfriend
					</Button>
				)}
			</div>
        </div> 
	)
}

export default OtherUserNav