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
	closeModal: (modal: boolean) => void;
	setOpen2FAModal: (modal: boolean) => void;
};

const CssTextField = styled(TextField)({
	"& label.Mui-focused": {
		color: "#ff3030",
	},
	"&  .MuiFormHelperText-root.Mui-error": {
		color: "white",
		backgroundColor: "white",
	},
	"& .MuiInputLabel-root": {
		color: "white",
	},
	"&  .MuiInputBase-root": {
		color: "#919eab",
	},
	"& .MuiFormHelperText-root": {
		color: "#919eab",
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

const EditModal: React.FC<EditModalProps> = ({
	closeModal,
	setOpen2FAModal,
}) => {
	const { state } = useContext(AppContext);
	const [userName, setUserName] = useState(state.mainUser.userName);
	const [userImage, setUserImage] = useState(state.mainUser.image);
	const [imageData, setImageData] = useState(state.mainUser.image);

	const [twoFAChecked, setTwoFAChecked] = useState(
		state.mainUser.isTwoFactorAuthenticationEnabled
	);

	// const test: string = state.mainUser.userName;
	const primary = red[500];
	const CHAR_LIMIT: number = 8;
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [values, setValues] = React.useState({
		name: `${state.mainUser.userName}`,
	});
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	// const src = state.mainUser.image;
	const editProfilePicture = (e: any) => {
		e.preventDefault();
		console.log("upload profile");

		// const formData = new FormData();

		// //   Update the formData object
		// formData.append("file", imageData);
		// formData.append("givenUserName", userName);

		// // Details of the uploaded file
		// console.log(userImage);

		// Request made to the backend api
		// Send formData object
		if (twoFAChecked) {
			if (!state.mainUser.isTwoFactorAuthenticationEnabled) {
				setOpen2FAModal(true);
			}
		}
		if (!twoFAChecked) {
			if (state.mainUser.isTwoFactorAuthenticationEnabled) {
				axios
					.post("http://192.168.99.121:5000/2fa/turnOff",{}, {
						withCredentials: true,
					})
					.then((res) => {
						console.log("turn of 2fa", res);
						state.eventsSocket.emit(
							"I_UPDATE_MY_PROFILE",
							state.mainUser.id
						);
					});
			}
		}
		if (imageData !== state.mainUser.image) {
			const formData = new FormData();

			//   Update the formData object
			formData.append("file", imageData);
			axios
				.post("http://192.168.99.121:5000/users/updateAvatar", formData, {
					withCredentials: true,
				})
				.then((res) => {
					state.eventsSocket.emit(
						"I_UPDATE_MY_PROFILE",
						state.mainUser.id
					);
					console.log("update avatar : ", res);
				});
		}
		if (userName != state.mainUser.userName) {
			// const formData = new FormData();
			// formData.append("givenUserName", userName);
			axios
				.post(
					"http://192.168.99.121:5000/users/updateUserName",
					{ givenUserName: userName },
					{
						withCredentials: true,
					}
				)
				.then((res) => {
					console.log("update userName :", res);
					state.eventsSocket.emit(
						"I_UPDATE_MY_PROFILE",
						state.mainUser.id
					);
				});
		}
		state.eventsSocket.emit("I_UPDATE_MY_PROFILE", state.mainUser.id);
		closeModal(false);
	};

	return (
		<>
			<div className="overlay-modal" onClick={() => closeModal(false)} />
			<div className="edit-modal">
				<div className="modal-picture">
					<div className="modal-picture-container">
						<Image
							loader={() => userImage}
							unoptimized={true}
							src={userImage}
							alt="avatar"
							layout="fill"
						/>
					</div>
					<div className="modal-picture-upload">
						<Button
							variant="contained"
							size="small"
							/*onClick={editProfilePicture}*/ component="label"
							style={{
								color: "white",
								backgroundColor: "#919eab",
							}}
						>
							Upload photo
							<input
								hidden
								accept="image/*"
								type="file"
								onChange={(event) => {
									if (
										event.target.files &&
										event.target.files[0]
									) {
										setImageData(event.target.files[0]);
										let imageUrl: File =
											event.target.files[0];
										URL.createObjectURL(imageUrl);
										console.log("image : upload");
										setUserImage(
											URL.createObjectURL(imageUrl)
										);
									}
								}}
							/>
						</Button>
					</div>
				</div>
				<div className="modal-data">
					<div className="modal-data-input">
						<CssTextField
							label="Username"
							inputProps={{
								maxLength: `${CHAR_LIMIT}`,
							}}
							helperText={`${userName.length}/${CHAR_LIMIT}`}
							defaultValue={userName}
							size="small"
							onChange={(e) => setUserName(e.target.value)}
						/>
					</div>
					<div className="modal-two-factor">
						<FormControlLabel
							label="TWO-FACTOR AUTH"
							labelPlacement="start"
							control={<Android12Switch />}
							checked={twoFAChecked}
							onClick={() => {
								setTwoFAChecked(!twoFAChecked);
							}}
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
								editProfilePicture(e);
								// closeModal(false)
							}}
						>
							Confirm
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditModal;
