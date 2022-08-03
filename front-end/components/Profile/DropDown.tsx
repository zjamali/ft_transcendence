import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import intra from "../../public/42.jpg";
import Link from "next/link";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Router from "next/router";
import cookies, { useCookies } from "react-cookie";
import PersonIcon from '@mui/icons-material/Person';
interface DropDown {
	userName: string;
	image: string;
}
const DropDown: React.FC<DropDown> = ({ userName, image }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const { state, setLogin, setMainUser } = useContext(AppContext);
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
	const handleLogOut = (e: any) => {
		state.chatSocket?.close();
		state.eventsSocket?.emit("LOG_OUT");
		state.eventsSocket?.close();
		removeCookie("access_token");
		setLogin(false);
		setMainUser(null);
	};
	useEffect(() => {
		if (!state.login) Router.push("/");
	}, [state.login]);
	return (
		<React.Fragment>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					textAlign: "center",
					backgroundColor: "#171d25",
				}}
			>
				<div
					className="user-container"
					onClick={handleClick}
					aria-controls={open ? "account-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
				>
					<Image
						unoptimized={true}
						loader={() => image}
						src={image}
						alt="avatar"
						layout="fill"
					/>
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
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 20,
							width: 10,
							height: 10,
							bgcolor: "#212b36",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
						"&:hover": {
							bgcolor: "none",
						},
						backgroundColor: "#212b36",
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<Link href="/">
					<MenuItem autoFocus={false} style={{ color: "#919eab" }}>
						{/* <Avatar /> */}
						<ListItemIcon style={{ color: "#919eab" }}>
						<PersonIcon fontSize="small"/>
						</ListItemIcon>
						 {userName}
					</MenuItem>
				</Link>
				<Divider />
				<Link href="/?edit_profile=true">
					<MenuItem style={{ color: "#919eab" }}>
						<ListItemIcon style={{ color: "#919eab" }}>
							<Settings fontSize="small" />
						</ListItemIcon>
						Settings
					</MenuItem>
				</Link>
				<MenuItem
					style={{ color: "#919eab" }}
					onClick={(e) => handleLogOut(e)}
				>
					<ListItemIcon style={{ color: "#919eab" }}>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
};

export default DropDown;
