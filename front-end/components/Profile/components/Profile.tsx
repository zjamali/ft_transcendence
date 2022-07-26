import Image from "next/image";
import Header from "./Header"
import SideBar from "./SideBar"
import intra from "../public/42.jpg"
import DefaultData from "./DefaultData"
import EditModal from "./EditModal"
import { useState } from "react";
import { Edit } from "@mui/icons-material";
import Portal from "./Portal"
import FriendsList from "./FriendsList"
import HistoryList from "./HistoryList";
import { Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Profile = () => {

	const [active, setActive] = useState<String>("DefaultData")
	const [openModal, setOpenModal] = useState<Boolean>(false)

	const renderComponent = (active: String) => {
		switch (active) {
			case "DefaultData": return <DefaultData />
			case "Friends": return <FriendsList />
			case "History": return <HistoryList />
		}
	}

	return (
		<div>
			<Header />
			<div className="profile-container">
				<SideBar />
				<div className="profile-content">
					<div className="profile-wall">
						<div className="profile-wall-bg">
						</div>
						<div className="profile-wall-img-user">
							<Image src={intra} alt="user avatar" layout="fill"/>
						</div>
						<div className="profile-wall-nav">
							{/* <div className="profile-btn-div" onClick={() => {setOpenModal(true)}}>
								<div className="svg-div active">
								<svg xmlns="http://www.w3.org/2000/svg" className="profile-icon" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
								</div>
								<div className="hidden-sidebar">Edit</div>
							</div>
							<div className="profile-btn-div" onClick={() => {setActive("DefaultData")}}>
								<div className="svg-div active">
								<svg xmlns="http://www.w3.org/2000/svg"  className="profile-icon" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
								</div>
								<div className="hidden-sidebar">Profile</div>
							</div>
							<div className="profile-btn-div" onClick={() => {setActive("Friends")}}>
								<div className="svg-div">
								<svg xmlns="http://www.w3.org/2000/svg" className="profile-icon" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/><path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>
								</div>
								<div className="hidden-sidebar">Friends</div>
							</div>
							<div className="profile-btn-div" onClick={() => setActive("History")}>
								<div className="svg-div">
								<svg xmlns="http://www.w3.org/2000/svg" className="profile-icon" viewBox="0 0 16 16"><path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z"/><path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .433-.335.504.504 0 0 1-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 0 0-.748 2.295 12.351 12.351 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.354 12.354 0 0 0-.339-2.406 13.753 13.753 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z"/></svg>
								</div>
								<div className="hidden-sidebar" >History</div>
							</div> */}
							<div style={{fontWeight: '400', color: "white"}}>username</div>
							<div className="add-or-remove">
								{
									!true ? <Button 
												variant="outlined" 
												color="primary" 
												size="small" 
												sx={{fontSize: 15, fontWeight: 200, textTransform: 'none', marginRight: 1}} 
												startIcon={<PersonAddIcon/>}
											>
												Add Friend
											</Button> : 
											<Button 
												variant="outlined" 
												color="error" 
												size="small"
												sx={{fontSize: 15, fontWeight: 200, textTransform: 'none', marginRight: 1}}
												startIcon={<PersonRemoveIcon/>}
											>
												Unfriend
											</Button>
								}
							</div>
						</div>
					</div>
					{renderComponent(active)}
					{/* {active === "DefaultData" && <DefaultData />}
					{active === "Friends" && "friends"}
					{active === "History" && "history"} */}
				</div>
				{ openModal ? <Portal><EditModal closeModal={setOpenModal} /> </Portal>: null}
			</div>
		</div>
	)
}

export default Profile;