// import React, { useContext, useEffect, useRef, useState } from 'react'
// import { AppContext } from '../../context/AppContext'
// import login2fa from '../styles/Chat.module.css'
// import { InputError } from '../chat/createChannel'
// import Modal from 'react-modal'
// export default function Create2FA(props: any) {
//   const [opne2faModal, setOpne2faModal] = useState(false)
//   const { state } = useContext(AppContext)

//   return (
//           //<form className={login2fa.login2fa}>
//           //  <img
//           //    src="http://192.168.99.121:5000/2fa/generate"
//           //    width={196}
//           //    height={196}
//           //  />
//           //  <div>
//           //    <label htmlFor="pinCode">Pin Code:</label>
//           //    <input type="text" name="pinCode" id="pinCode" />
//           //  </div>
//           //  <div>
//           //    <InputError message="Incorrect Pin Code" />
//           //  </div>
//           //  <div>
//           //    <button type="submit" className={login2fa.room_button}>
//           //      submit
//           //    </button>
//           //    <button
//           //      onClick={(e) => {
//           //        e.preventDefault()
//           //        setOpne2faModal(false)
//           //      }}
//           //      className={login2fa.leave_room + ' ' + login2fa.room_button}
//           //    >
//           //      cancel
//           //    </button>
//           //  </div>
//           //</form>

//   )
// }

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
// import "./../styles/Profile.css"

type EditModalProps = {
	closeModal2FA: (modal: boolean) => void;
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

const Android12Switch = styled(Switch)(({ theme }) => ({
	padding: 8,
	"& .MuiSwitch-track": {
		borderRadius: 22 / 2,
		"&:before, &:after": {
			content: '""',
			position: "absolute",
			top: "50%",
			transform: "translateY(-50%)",
			width: 16,
			height: 16,
		},
		"&:before": {
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
				theme.palette.getContrastText(theme.palette.primary.main)
			)}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
			left: 12,
		},
		"&:after": {
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
				theme.palette.getContrastText(theme.palette.primary.main)
			)}" d="M19,13H5V11H19V13Z" /></svg>')`,
			right: 12,
		},
	},
	"& .MuiSwitch-thumb": {
		boxShadow: "none",
		width: 16,
		height: 16,
		margin: 2,
	},
}));

const Active2FA: React.FC<EditModalProps> = ({ closeModal2FA }) => {
	const { state } = useContext(AppContext);
	const [twoFAcode, setTwoFAcode] = useState("");

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	// const src = state.mainUser.image;
	const handleActivate2FA = (e: any) => {
		e.preventDefault();
		console.log("activate 2FA");

		try {
			axios
				.post(
					"http://192.168.99.121:5000/2fa/turnOn",
					{ twoFactorAuthenticationCode: twoFAcode },
					{
						withCredentials: true,
					}
				)
				.then((response) => {
					console.log("add qr code  : ", response);
						closeModal2FA(false);
						state.eventsSocket.emit(
							"I_UPDATE_MY_PROFILE",
							state.mainUser.id
						);
				});
		} catch (error) {
			console.log("error : ", error);
		}
	};

	const twoFAGenrated = "http://192.168.99.121:5000/2fa/generate";
	return (
		<>
			<div
				className="overlay-modal"
				onClick={() => closeModal2FA(false)}
			/>
			<div className="edit-modal-qr">
				<div className="modal-picture">
					<div
						className="modal-picture-qr-container"
						style={{
							borderRadius: "5px",
							width: "150px",
							height: "150px",
						}}
					>
						<Image
							loader={() => twoFAGenrated}
							unoptimized={true}
							src={twoFAGenrated}
							alt="avatar"
							layout="fill"
							objectFit="fill"
							style={{ scale: 0.3 }}
						/>
					</div>
				</div>
				<div>
					<div className="modal-data">
						<div className="modal-data-input">
							<CssTextField
								label="Enter Two Factor auth"
								defaultValue={twoFAcode}
								size="small"
								onChange={(e) => setTwoFAcode(e.target.value)}
								style={{ marginLeft: "30px" }}
							/>
						</div>
					</div>
					<div className="modal-buttons">
						<div className="modal-submit">
							<Button
								variant="outlined"
								size="small"
								color="success"
								onClick={(e) => {
									handleActivate2FA(e);
								}}
							>
								ACTIVATE 2FA
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Active2FA;
