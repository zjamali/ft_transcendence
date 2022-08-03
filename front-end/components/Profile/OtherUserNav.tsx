import * as React from 'react'
import { useContext, useState,useEffect, ReactNode } from 'react'
import { Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { AppContext } from '../../context/AppContext'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { addFriend, blockUser, unBlockUser, unfriend } from '../../utils/utils'
import axios from 'axios'
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface OtherUserNav {
	userName: string,
	id: string,
	props?: ReactNode
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
  ) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
const OtherUserNav: React.FC<OtherUserNav> = (props) => {
	console.log(props.userName)
	const {state , setFriends} = useContext(AppContext);
	const [isFriend, setIsFriend] = useState(false);
	const [isblockedUser, setIsBlockedUser] = useState(false);

	useEffect(()=> {
		fetchFriends();
		fetchBlocked();
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
						if (friend.userName === props.userName)
						{
							setIsFriend(true);
							// console.log("is friend");
							return;
						}
					})
				});
		} catch {
			console.log(" other CANT GET ALL USERS");
		}
	}
	async function fetchBlocked() {
		try {
			axios
				.get(
					`http://localhost:5000/users/blocked`,
					{
						withCredentials: true,
					}
				)
				.then((res) => {
					console.log("other blocked  : ", res.data);
					[...res.data].map((User : any) =>{
						if (User.userName === props.userName)
						{
							setIsBlockedUser(true);
							// console.log("is friend");
							return;
						}
					})
				});
		} catch {
			console.log(" other CANT GET ALL USERS");
		}
	}
	const [open, setOpen] = useState(false);
  
	const handleClick = () => {
	  setOpen(true);
	};
  
	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
	  if (reason === 'clickaway') {
		return;
	  }
  
	  setOpen(false);
	};
	
	return (
		<div className="profile-wall-nav">
			<div style={{ fontWeight: '400', color: 'white' }}>{props.userName}</div>
			<div>
				{ !isblockedUser ?
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
					onClick={(e)=> {e.preventDefault(); blockUser(props.id);}}
					>
					Block
				</Button>
				:
				<Button
				variant="outlined"
				color="success"
				size="small"
				sx={{
					fontSize: 15,
					fontWeight: 300,
					textTransform: 'none',
					marginRight: 1,
					width: 110
				}}
					startIcon={<RemoveCircleIcon />}
					onClick={(e)=> {e.preventDefault(); unBlockUser(props.id);}}
					>
					Unblock
				</Button>
					}
			</div>
			<div className="add-or-remove">
				{ !isFriend ? (
					<Stack spacing={2} sx={{ width: '100%' }}>
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
					onClick={(e)=> {e.preventDefault(); addFriend(state.mainUser.id,props.id); handleClick()}}
					>
					Add Friend
					</Button>
						<Snackbar open={open} autoHideDuration={2200} onClose={handleClose}>
						  <Alert variant="outlined" onClose={handleClose} severity="success" sx={{ width: '100%', color: '#3b8243' }}>
							Friend request sent !
						  </Alert>
						</Snackbar>
					  </Stack>
				) : (
					<Stack spacing={2} sx={{ width: '100%' }}>

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
						onClick={(e)=> {e.preventDefault(); unfriend(props.id); handleClick()}}
						>
						Unfriend
						</Button>
						<Snackbar open={open} autoHideDuration={2200} onClose={handleClose}>
							<Alert variant="outlined" onClose={handleClose} severity="error" sx={{ width: '100%', color: '#c24543' }}>
								Friend removed !
							</Alert>
						</Snackbar>
					</Stack>
				)}
			</div>
        </div> 
	)
}

export default OtherUserNav