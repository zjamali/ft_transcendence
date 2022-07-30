import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import {useState} from "react";
import Notification from "./Notification"



const DropDNotifications: React.FC = ({...props}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
	  setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
	  setAnchorEl(null);
	};

	return (
		<React.Fragment>
			<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', backgroundColor: '#171d25' }}>
				{/* <div className="user-container" onClick={handleClick} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
					<Image src={intra} alt="avatar" layout="fill" />
				</div> */}
				<button className="btn-notification" onClick={handleClick} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true': undefined}>
					<svg xmlns="http://www.w3.org/2000/svg"className="notification-icon" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/></svg>
				</button>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
				elevation: 0,
				sx: {
					width: 300,
					overflow: 'visible',
					filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
					mt: 1.5,
					'& .MuiAvatar-root': {
					width: 32,
					height: 32,
					ml: -0.5,
					mr: 1,
					},
					'&:before': {
					content: '""',
					display: 'block',
					position: 'absolute',
					top: 0,
					right: 20,
					width: 10,
					height: 10,
					bgcolor: '#212b36',
					transform: 'translateY(-50%) rotate(45deg)',
					zIndex: 0,
					},
					'&:hover': {
						bgcolor: "none",
					},
					backgroundColor:'#212b36',
				},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem autoFocus={false} style={{color: "white", fontWeight: '100', height: '50px'}}>
					Notifications 
				</MenuItem>
				<Divider sx={{color: 'white'}}/>
				<Notification />
				<Notification />
			</Menu>
		</React.Fragment>
	)

}

export default DropDNotifications