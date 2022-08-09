import * as React from "react";
import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import Switch, { SwitchProps } from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useRouter } from "next/router";

type EditModalProps = {
	setOpenInviteModal: (modal: boolean) => void;
	inviteSender: any;
	senderSocketId: string;
};

const CssTextField = styled(TextField)({
	"& label.Mui-focused": {
		color: "#ff3030",
	},
	"& .MuiInputLabel-root": {
		color: "white",
	},
	"&  .MuiInputBase-root": {
		color: "#919eab",
	},

	" &.MuiFormHelperText-root.Mui-error": {
		backgroundColor: "white",
		color: "white",
	},

	"&  .MuiInputBase-root: hover": {
		color: "white",
	},
	"& .MuiInput-underline:after": {
		borderBottomColor: "white",
	},
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#919eab",
		},
		"&:hover fieldset": {
			borderColor: "white",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#ff3030",
			color: "white",
		},
	},
});

const InviteGameModale: React.FC<EditModalProps> = ({
	setOpenInviteModal,
	inviteSender,
	senderSocketId,
}) => {
	const { state } = useContext(AppContext);
	const router = useRouter();
	// const test: string = state.mainUser.userName;
	const primary = red[500];
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	// const src = state.mainUser.image;

	const gameHandleAcceptInvite = (e: any) => {
		e.preventDefault();
		router.push("/game");
		state.eventsSocket.emit("accept_game_invitaion_to_server", {
			sender: inviteSender.id,
			receiver: state.mainUser.id,
			game_room: `${inviteSender.id}${state.mainUser.id}`,
			senderSocketId: senderSocketId,
		});
		setOpenInviteModal(false);
	};

	return (
		<>
			<div
				className="overlay-modal"
				onClick={() => setOpenInviteModal(false)}
			/>
			<div className="invite-modal">
				<div className="modal-data">
					<div className="modal-data-input">
						<h5>
							{inviteSender.userName} invite you to play a pong
							Game
						</h5>
					</div>
				</div>
				<div className="modal-buttons">
					<div className="modal-submit">
						<Button
							variant="outlined"
							size="small"
							color="success"
							onClick={(e) => {
								gameHandleAcceptInvite(e);
							}}
						>
							Accept
						</Button>
						{"         "}
						<Button
							variant="outlined"
							size="small"
							color="error"
							onClick={(e) => {
								setOpenInviteModal(false);
							}}
						>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default InviteGameModale;
