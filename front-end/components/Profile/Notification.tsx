import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { acceptFriendRequest, unfriend } from "../../utils/utils";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Notification = (props: any) => {
	const { state } = useContext(AppContext);
	return (
		<div style={{ width: "100%" }}>
			<MenuItem
				style={{
					color: "#919eab",
					height: "40px",
					width: "100%",
					display: "grid",
					gridTemplateColumns: "1fr 8fr",
					gap: "10px",
				}}
			>
				<div
					style={{
						position: "relative",
						borderRadius: "50px",
						overflow: "hidden",
						width: "30px",
						height: "30px",
					}}
				>
					<Image
						loader={() => props.user.image}
						src={props.user.image}
						unoptimized={true}
						alt="avatar"
						layout="fill"
					/>
				</div>
				<div
					style={{
						marginLeft: "",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						width: "100%",
						justifyContent: "space-between",
					}}
				>
					<div>{props.user.userName}</div>
					<div style={{ marginLeft: "0" }}>
						<IconButton
							color="error"
							onClick={(e) => {
								e.preventDefault();
								unfriend(state.mainUser.id, props.user.id);
							}}
						>
							<CloseIcon />
						</IconButton>
						{props.friendRequest && (
							<IconButton
								color="success"
								onClick={(e) => {
									e.preventDefault();
									acceptFriendRequest(
										state.mainUser.id,
										props.user.id
									);
								}}
							>
								<DoneRoundedIcon />
							</IconButton>
						)}
					</div>
				</div>
			</MenuItem>
			<Divider />
		</div>
	);
};

export default Notification;
