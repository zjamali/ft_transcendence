import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useContext, useEffect, useState } from "react";
import Notification from "./Notification";
import { User } from "../../utils/interfaces";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Badge from "@mui/material/Badge";

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
// 	props,
// 	ref,
//   ) {
// 	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
//   });

// function CustomizedSnackbars() {
// 	const [open, setOpen] = useState(false);

// 	const handleClick = () => {
// 	  setOpen(true);
// 	};

// 	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
// 	  if (reason === 'clickaway') {
// 		return;
// 	  }

// 	  setOpen(false);
// 	};

// 	return (
// 	  <Stack spacing={2} sx={{ width: '100%' }}>
// 		<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
// 		  <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
// 			This is a success message!
// 		  </Alert>
// 		</Snackbar>
// 		<Alert severity="success">This is a success message!</Alert>
// 	  </Stack>
// 	);
//   }

const DropDNotifications: React.FC = (props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const { state } = useContext(AppContext);
	const [recievedrequests, setRecievedrequests] = useState<User[]>([]);
	const [sentrequests, setSentRequests] = useState<User[]>([]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		fetchFriendsRequest();
		fetchSentRequest();
		state.eventsSocket.on("NEW_PENDING_REQUEST", () => {
			fetchFriendsRequest();
			fetchSentRequest();
		});
		state.eventsSocket.on("NEW_FRIEND_REQUEST", () => {
			fetchFriendsRequest();
			fetchSentRequest();
		});
		state.eventsSocket.on("UPDATE_DATA", () => {
			console.log("drop down notification");
			fetchFriendsRequest();
			fetchSentRequest();
		});
		return () => {
			state.eventsSocket.off("NEW_FRIEND_REQUEST");
			state.eventsSocket.off("UPDATE_DATA");
		};
	}, [state.contacts]);

	const fetchFriendsRequest = () => {
		axios
			.get(`${process.env.SERVER_HOST}/users/recievedrequests`, {
				withCredentials: true,
			})
			.then((responce) => {
				if ([...responce.data].length > 0)
					setRecievedrequests([...responce.data]);
				else setRecievedrequests([]);
			});
	};
	const fetchSentRequest = async () => {
		axios
			.get(`${process.env.SERVER_HOST}/users/sentrequests`, {
				withCredentials: true,
			})
			.then((responce) => {
				if ([...responce.data].length)
					setSentRequests([...responce.data]);
				else setSentRequests([]);
			});
	};

	return (
		<React.Fragment>
			{/* {CustomizedSnackbars()} */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					textAlign: "center",
					backgroundColor: "#171d25",
				}}
			>
				<button
					className="btn-notification"
					onClick={handleClick}
					aria-controls={open ? "account-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
				>
					{recievedrequests.length != 0 ? (
						<Badge
							badgeContent={recievedrequests.length}
							color="error"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="notification-icon"
								viewBox="0 0 16 16"
							>
								<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
							</svg>
						</Badge>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="notification-icon"
							viewBox="0 0 16 16"
						>
							<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
						</svg>
					)}
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
				<MenuItem
					autoFocus={false}
					style={{
						color: "white",
						fontWeight: "100",
						height: "50px",
					}}
				>
					Friend Requests
				</MenuItem>
				<Divider sx={{ color: "white" }} />
				{recievedrequests?.map((recievedrequest) => (
					<Notification
						friendRequest={true}
						user={recievedrequest}
						key={recievedrequest.id}
					/>
				))}
				<MenuItem
					autoFocus={false}
					style={{
						color: "white",
						fontWeight: "100",
						height: "50px",
					}}
				>
					Sent Requests
				</MenuItem>
				<Divider sx={{ color: "white" }} />
				{sentrequests?.map((sentrequest) => (
					<Notification
						friendRequest={false}
						user={sentrequest}
						key={sentrequest.id}
					/>
				))}
			</Menu>
		</React.Fragment>
	);
};

export default DropDNotifications;
