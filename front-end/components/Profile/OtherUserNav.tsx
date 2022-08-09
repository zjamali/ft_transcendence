import * as React from "react";
import { useContext, useState, useEffect, ReactNode } from "react";
import { Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { AppContext } from "../../context/AppContext";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { addFriend, blockUser, unBlockUser, unfriend } from "../../utils/utils";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface OtherUserNav {
	userName: string;
	id: string;
	props?: ReactNode;
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const OtherUserNav: React.FC<OtherUserNav> = (props) => {
	console.log(props.userName);
	const { state, setFriends } = useContext(AppContext);
	const [isFriend, setIsFriend] = useState(false);
	const [isblockedUser, setIsBlockedUser] = useState(false);

	useEffect(() => {
		fetchFriends();
		fetchBlocked();
		state.eventsSocket.on("UPDATE_DATA", () => {
			fetchFriends();
			fetchBlocked();
		});
		return () => {
			state.eventsSocket.off("A_PROFILE_UPDATE");
		};
	});

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
					console.log("other nav friende  : ", res.data);
					if (res.data.length == 0) setIsFriend(false);
					[...res.data].map((friend: any) => {
						if (friend.userName === props.userName) {
							setIsFriend(true);
							console.log("is friend");
							return;
						} else {
							console.log("is not friend");
							setIsFriend(false);
						}
					});
				});
		} catch {
			console.log(" other CANT GET ALL USERS");
		}
	}
	async function fetchBlocked() {
		try {
			axios
				.get(`http://localhost:5000/users/blocked`, {
					withCredentials: true,
				})
				.then((res) => {
					console.log("other blocked  : ", res.data);
					if ([...res.data].length === 0) setIsBlockedUser(false);
					[...res.data].map((User: any) => {
						if (User.userName === props.userName) {
							setIsBlockedUser(true);
							// console.log("is friend");
							return;
						}
					});
				});
		} catch {
			console.log(" other CANT GET ALL USERS");
		}
	}
	const [open, setOpen] = useState(false);
	// const [openUnfriend, setOpenUnfriend] = useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	// const handleClickUnf = () => {
	// 	setOpenUnfriend(true)
	// 	alert("testesttest")
	// }

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	return (
		<div className="profile-wall-nav">
			<div style={{ fontWeight: "400", color: "white" }}>
				{props.userName}
			</div>
			<div className="block-or-unblock">
				{!isblockedUser ? (
					<Button
						variant="outlined"
						color="error"
						size="small"
						sx={{
							fontSize: 15,
							fontWeight: 300,
							textTransform: "none",
							marginRight: 1,
							width: 110,
						}}
						startIcon={<RemoveCircleIcon />}
						onClick={(e) => {
							e.preventDefault();
							blockUser(state.mainUser.id,  props.id);
						}}
					>
						Block
					</Button>
				) : (
					<Button
						variant="outlined"
						color="success"
						size="small"
						sx={{
							fontSize: 15,
							fontWeight: 300,
							textTransform: "none",
							marginRight: 1,
							width: 110,
						}}
						startIcon={<RemoveCircleIcon />}
						onClick={(e) => {
							e.preventDefault();
							unBlockUser(state.mainUser.id, props.id);
						}}
					>
						Unblock
					</Button>
				)}
			</div>
			<div className="add-or-remove">
				{!isblockedUser ? (!isFriend ? (
					<Stack spacing={2} sx={{ width: "100%" }}>
						<Button
							variant="outlined"
							color="primary"
							size="small"
							sx={{
								fontSize: 15,
								fontWeight: 300,
								textTransform: "none",
								marginRight: 1,
								// '& @media (max-width:300px)': {
								// 	fontSize: 10,
								// },
							}}
							startIcon={<PersonAddIcon />}
							onClick={(e) => {
								e.preventDefault();
								addFriend(state.mainUser.id, props.id);
								// if (!isFriend)
								handleClick();
							}}
						>
							Add Friend
						</Button>
						<Snackbar
							open={open}
							autoHideDuration={2200}
							onClose={handleClose}
						>
							<Alert
								variant="outlined"
								onClose={handleClose}
								severity="success"
								sx={{ width: "100%", color: "#3b8243" }}
							>
								Friend request sent !
							</Alert>
						</Snackbar>
					</Stack>) 
				: (<Button
							variant="outlined"
							color="error"
							size="small"
							sx={{
								fontSize: 15,
								fontWeight: 300,
								textTransform: "none",
								marginRight: 1,
							}}
							startIcon={<PersonRemoveIcon />}
							onClick={(e) => {
								e.preventDefault();
								unfriend(state.mainUser.id, props.id);
								// handleClickUnf();
							}}
						>
							Unfriend
					</Button>)) : null
				}
			</div>
		</div>
	);
};

export default OtherUserNav;
