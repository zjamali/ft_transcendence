import Image from 'next/image'
import Header from './Header'
import SideBar from './SideBar'
import intra from '../../public/42.jpg'
import DefaultData from './DefaultData'
import EditModal from './EditModal'
import { useContext, useState,useEffect } from 'react'
import { Edit } from '@mui/icons-material'
import Portal from './Portal'
import FriendsList from './FriendsList'
import HistoryList from './HistoryList'
import { Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { ChatContext } from '../../context/chatContext'
import MainUserNav from './MainUserNav'


const OtherUserNav: React.FC = () => {
	return (
		<div className="profile-wall-nav">
			<div style={{ fontWeight: '400', color: 'white' }}>username</div>
			<div className="add-or-remove">
				{true ? (
					<Button
					variant="outlined"
					color="primary"
					size="small"
					sx={{
						fontSize: 15,
						fontWeight: 200,
						textTransform: 'none',
						marginRight: 1,
					}}
					startIcon={<PersonAddIcon />}
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
						fontWeight: 200,
						textTransform: 'none',
						marginRight: 1,
					}}
					startIcon={<PersonRemoveIcon />}
					>
					Unfriend
					</Button>
				)}
			</div>
        </div> 
	)
}

export default OtherUserNav