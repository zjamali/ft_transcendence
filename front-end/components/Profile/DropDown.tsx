import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {useState} from "react";
import Image from "next/image"
import intra from '../../public/42.jpg'
interface DropDown {
	userName: string,
	image: string
}
const DropDown: React.FC<DropDown> = ({userName, image}) => {
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
				<div className="user-container" onClick={handleClick} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
					<Image unoptimized={true} loader={()=> image} src={image} alt="avatar" layout="fill" />
				</div>
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
				<MenuItem autoFocus={false} style={{color: "#919eab",}}>
					<Avatar /> {userName}
				</MenuItem>
				<Divider />
				<MenuItem  style={{color: "#919eab"}}>
					<ListItemIcon style={{color: "#919eab"}}>
						<Settings fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
				<MenuItem style={{color: "#919eab"}}>
					<ListItemIcon style={{color: "#919eab"}}>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</React.Fragment>
	)

}

export default DropDown