import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import channelManagemetStyle from "../../styles/Chat.module.css";
import Modal from "react-modal";
import { InputError } from "./createChannel";
import Select from "react-select";
import axios from "axios";
import { Channel, User } from "../../utils/interfaces";
import ReactLoading from "react-loading";
import { validatePassword } from "../../regex/createChannelRegex";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "@mui/material";

function ManageMembers(props: any) {
	const { state } = useContext(AppContext);
	const [timetoMute, setTimetoMute] = useState<Number>(0);
	const [Admins, setAdmins] = useState<[{}]>([{}]);
	const [banned, setBanned] = useState<[{}]>([{}]);
	const [kickedUser, setKickedUser] = useState<[{}]>([{}]);
	const [mutedUsers, setMutedUsers] = useState<[{}]>([{}]);
	const [selectedAdminsOption, setSelectedAdminsOption] = useState<any>(null);
	const [selectedBannedsOption, setSelectedBannedsOption] = useState<any>(
		null
	);
	const [selectedMutedusersOption, setSelectedMutedusersOption] = useState<
		any
	>(null);
	const [selectedKickedUserOption, setSelectedKickedUserOption] = useState<
		any
	>(null);
	const [isNewPasswordCorrects, setIsNewPasswordCorrects] = useState(true);
	const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] = useState(
		true
	);
	const [updatePassword, setUpdatePassword] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");

	const [loadingRoomDataIsDone, setLoadingRoomDataIsDone] = useState<boolean>(
		false
	);

	const [roomSettingOption, setRoomSettingOption] = useState<any>({
		value: "default",
		label: "default",
	});
	// const [roomSettingOption, setRoomSettingOption] = useState<any>(null);

	const roomSettingAllOption =
		props.room.owner === state.mainUser.id
			? [
					{ value: "admins", label: "set / unset admins" },
					{ value: "password", label: "add / edit-delete password" },
					{ value: "muted", label: "mute / umute  users" },
					{ value: "banned", label: "ban / unban a user" },
					{ value: "kick", label: "kick a user" },
					{ value: "delete", label: " delete channel" },
			  ]
			: [
					{ value: "admins", label: "set / unset admins" },
					{ value: "muted", label: "mute / umute  users" },
					{ value: "banned", label: "ban / unban a user" },
					{ value: "kick", label: "kick a user" },
			  ];

	async function getRoomMembers(roomid: string) {
		try {
			return await axios.get(
				`${process.env.SERVER_HOST}/rooms/${roomid}/members`,
				{
					withCredentials: true,
				}
			);
		} catch (error) {
			return null;
		}
	}

	async function getRoomAdmins(roomid: string) {
		try {
			return await axios.get(
				`${process.env.SERVER_HOST}/rooms/${roomid}/admins`,
				{
					withCredentials: true,
				}
			);
		} catch (error) {
			return null;
		}
	}
	async function getRoomBanned(roomid: string) {
		try {
			return await axios.get(
				`${process.env.SERVER_HOST}/rooms/${roomid}/banned`,
				{
					withCredentials: true,
				}
			);
		} catch (error) {
			return null;
		}
	}
	async function getRoomMuted(roomid: string) {
		try {
			return await axios.get(
				`${process.env.SERVER_HOST}/rooms/${roomid}/muted`,
				{
					withCredentials: true,
				}
			);
		} catch (error) {
			return null;
		}
	}

	function removeChannelPassword(e: any) {
		e.preventDefault();
		/// check current password is correct
		props.chatSocket.emit(
			"CHECK_ROOM_PASSWORD",
			{
				room_id: `${props.room.id}`,
				password: `${currentPassword}`,
			},
			(checkPassword: boolean) => {
				if (!checkPassword) {
					setIsCurrentPasswordCorrect(false);
					return;
				} else {
					props.chatSocket.emit("ROOM_REMOVE_PASSWORD", {
						admin_id: state.mainUser.id,
						room_id: props.room.id,
					});
					props.setOpenSettingModal(false);
				}
			}
		);
		// if (isPasswordCorrect)
		// {
		//   props.chatSocket.emit('ROOM_REMOVE_PASSWORD', {
		//     admin_id: `${state.mainUser.id}`,
		//     room_id: `${props.room.id}`,
		//   })
		//   props.setOpenSettingModal(false)
		// }
	}

	useEffect(() => {
		

		getRoomMembers(props.room.id)
			.then((Allmembers) => {
				return Allmembers?.data;
			})
			.then((members) => {
				const membersAsOption = members?.map((member: User) => {
					return {
						value: member.id,
						label: `${member.firstName} ${member.lastName}`,
					};
				});

				setBanned(
					membersAsOption.filter(
						(member: any) => member.value != state.mainUser.id
					)
				);
				setKickedUser(
					membersAsOption.filter(
						(member: any) => member.value != state.mainUser.id
					)
				);
				setMutedUsers(
					membersAsOption.filter(
						(member: any) => member.value != state.mainUser.id
					)
				);
				setAdmins(
					membersAsOption.filter((member: any) => {
						return member.value != props.room.owner;
					})
				);
			});

		getRoomAdmins(props.room.id).then((admins) => {
			const adminAsOption = admins?.data.map((admin: User) => {
				if (admin.id != props.room.owner) {
					return {
						value: admin.id,
						label: `${admin.firstName} ${admin.lastName}`,
					};
				}
			});
			
			setSelectedAdminsOption(adminAsOption);
		});

		getRoomBanned(props.room.id).then((bannedUsers) => {
			const bannedAsOption = bannedUsers?.data.map((banned: User) => {
				return {
					value: banned.id,
					label: `${banned.firstName} ${banned.lastName}`,
				};
			});
			
			setSelectedBannedsOption(bannedAsOption);
		});

		getRoomMuted(props.room.id).then((mutedUsers) => {
			const mutedAsOption = mutedUsers?.data.map((muted: User) => {
				return {
					value: muted.id,
					label: `${muted.firstName} ${muted.lastName}`,
				};
			});
			
			setSelectedMutedusersOption(mutedAsOption);
		});
	}, []);

	useEffect(() => {
		
		if (
			selectedAdminsOption &&
			selectedBannedsOption &&
			selectedMutedusersOption
		)
			setLoadingRoomDataIsDone(true);
	}, [selectedAdminsOption, selectedBannedsOption, selectedMutedusersOption]);

	const customStyles = {
		option: (provided: any) => ({
			...provided,
			color: "#212b36",
		}),
	};

	function handleChannelSetting(e: any) {
		e.preventDefault();
		if (!roomSettingOption) return;
		else {
			if (roomSettingOption.value === "delete" && loadingRoomDataIsDone) {
				
				props.chatSocket.emit("DELETE_ROOM", {
					admin_id: `${state.mainUser.id}`,
					room_id: `${props.room.id}`,
				});
				props.setOpenSettingModal(false);
			}
			if (
				roomSettingOption.value === "kick" &&
				loadingRoomDataIsDone &&
				selectedKickedUserOption
			) {
				/// 'ROOM_KICKED_USER';
				props.chatSocket.emit("ROOM_KICKED_USER", {
					admin_id: `${state.mainUser.id}`,
					room_id: `${props.room.id}`,
					new_kicked: selectedKickedUserOption,
				});
				props.setOpenSettingModal(false);
			}
			if (
				roomSettingOption.value === "banned" &&
				loadingRoomDataIsDone &&
				selectedBannedsOption
			) {
				/// 'ROOM_banne_USER';
				props.chatSocket.emit("ROOM_BAN_A_USER", {
					admin_id: `${state.mainUser.id}`,
					room_id: `${props.room.id}`,
					banned: selectedBannedsOption,
				});
				props.setOpenSettingModal(false);
			}
			if (roomSettingOption.value === "muted" && loadingRoomDataIsDone) {
				
				props.chatSocket.emit("ROOM_MUTE_USERS", {
					admin_id: `${state.mainUser.id}`,
					room_id: `${props.room.id}`,
					muted_user: selectedMutedusersOption,
					timeToMute: timetoMute,
				});
				props.setOpenSettingModal(false);
			}
			if (
				roomSettingOption.value === "admins" &&
				loadingRoomDataIsDone &&
				selectedAdminsOption
			) {
				/// 'ROOM_SET_ADMIN';
				props.chatSocket.emit("ROOM_ADMINS_STATUS", {
					admin_id: `${state.mainUser.id}`,
					room_id: `${props.room.id}`,
					new_admins: [...selectedAdminsOption],
				});
				props.setOpenSettingModal(false);
			}
			if (
				roomSettingOption.value === "password" &&
				loadingRoomDataIsDone
			) {
				/// 'ROOM_Update_passord';
				if (!props.room.isProtected) {
					if (!validatePassword.test(updatePassword)) {
						setIsNewPasswordCorrects(false);
					} else {
						props.chatSocket.emit("ROOM_ADD_PASSWORD", {
							admin_id: `${state.mainUser.id}`,
							room_id: `${props.room.id}`,
							password: updatePassword,
						});
						props.setOpenSettingModal(false);
					}
					return;
				}
				props.chatSocket.emit(
					"CHECK_ROOM_PASSWORD",
					{
						room_id: `${props.room.id}`,
						password: `${currentPassword}`,
					},
					(checkPassword: boolean) => {
						if (!checkPassword) {
							setIsCurrentPasswordCorrect(false);
							return;
						} else {
							if (!validatePassword.test(updatePassword)) {
								setIsNewPasswordCorrects(false);
							} else {
								props.chatSocket.emit("ROOM_UPDATE_PASSWORD", {
									admin_id: `${state.mainUser.id}`,
									room_id: `${props.room.id}`,
									new_password: updatePassword,
								});
								props.setOpenSettingModal(false);
							}
						}
					}
				);
			}
		}
	}

	useEffect(() => {
		// props.chatSocket.on("connect_failed", () => {
		// 	
		// 		"Sorry, there seems to be an issue with the connection!"
		// 	);
		// });
		// props.chatSocket.on("connect_error", () => {
		// 	
		// 		"Sorry, there seems to be an issue with the connection!"
		// 	);
		// });
		// props.chatSocket.on("connect_failed", () => {
		// 	
		// 		"Sorry, there seems to be an issue with the connection!"
		// 	);
		// });
		// props.chatSocket.on("disconnect", () => {
		// 	
		// 		"Sorry, there seems to be an issue with the connection!"
		// 	);
		// });

		return () => {};
	}, []);

	return (
		<div className={channelManagemetStyle.manageMembers}>
			<div>
				<h3 style={{ marginBottom: "20px" }}>Settings Option : </h3>
				<Select
					defaultValue={roomSettingOption}
					styles={customStyles}
					onChange={setRoomSettingOption}
					options={roomSettingAllOption}
				/>
			</div>
			{loadingRoomDataIsDone ? (
				<form onSubmit={(e) => handleChannelSetting(e)}>
					{roomSettingOption.value === "admins" && (
						<div>
							<h3>Admis : </h3>
							<Select
								styles={customStyles}
								isMulti
								defaultValue={selectedAdminsOption}
								onChange={setSelectedAdminsOption}
								options={Admins}
							/>
						</div>
					)}
					{roomSettingOption.value === "banned" && (
						<div>
							<h3> banned User : </h3>
							<Select
								styles={customStyles}
								isMulti
								defaultValue={selectedBannedsOption}
								onChange={setSelectedBannedsOption}
								options={banned}
							/>
						</div>
					)}
					{roomSettingOption.value === "muted" && (
						<div>
							<h3> muted User : </h3>
							<Select
								styles={customStyles}
								isMulti
								defaultValue={selectedMutedusersOption}
								onChange={setSelectedMutedusersOption}
								options={mutedUsers}
							/>
							<input
								className={channelManagemetStyle.input}
								type="number"
								name="mutedTime"
								id="mutedTime"
								min={0}
								max={60}
								value={String(timetoMute)}
								onChange={(e: any) =>
									setTimetoMute(Number(e.target.value))
								}
								placeholder="in minutes"
							/>
						</div>
					)}
					{roomSettingOption.value === "kick" && (
						<div>
							<h3> kick a User : </h3>
							<Select
								styles={customStyles}
								// isMulti
								defaultValue={selectedKickedUserOption}
								onChange={setSelectedKickedUserOption}
								options={kickedUser}
							/>
						</div>
					)}
					{roomSettingOption.value === "password" &&
						state.receiver.owner === state.mainUser.id && (
							<div>
								<h3>
									{props.room.isProtected
										? "update Password"
										: "add password"}
								</h3>
								{props.room.isProtected ? (
									<div>
										<input
											className={
												channelManagemetStyle.input
											}
											type="password"
											name="current password"
											id="current password"
											placeholder="current password"
											value={currentPassword}
											onChange={(e) => {
												setCurrentPassword(
													e.target.value
												);
											}}
										/>
										{!isCurrentPasswordCorrect && (
											<InputError message="wrong password" />
										)}
										<input
											className={
												channelManagemetStyle.input
											}
											type="password"
											name="update password"
											id="new password"
											placeholder="new password"
											value={updatePassword}
											onChange={(e) => {
												setUpdatePassword(
													e.target.value
												);
											}}
										/>
										{!isNewPasswordCorrects && (
											<InputError message=" enter password between 8 - 16" />
										)}
										{updatePassword.length === 0 && (
											<button
												className={
													channelManagemetStyle.room_button +
													" " +
													channelManagemetStyle.leave_room
												}
												onClick={(e) =>
													removeChannelPassword(e)
												}
											>
												remove Password
											</button>
										)}
									</div>
								) : (
									<div>
										<input
											className={
												channelManagemetStyle.input
											}
											type="password"
											name="new password"
											id="new password"
											placeholder="new password"
											value={updatePassword}
											onChange={(e) => {
												setUpdatePassword(
													e.target.value
												);
											}}
										/>
										{!isNewPasswordCorrects && (
											<InputError message=" enter password between 8 - 16" />
										)}
									</div>
								)}
							</div>
						)}
					<button
						className={channelManagemetStyle.room_button}
						type="submit"
					>
						save
					</button>
				</form>
			) : (
				<ReactLoading type={"spinningBubbles"} color="#fff" />
			)}
		</div>
	);
}

function ChannelSettings(props: any) {
	const [openSettingModal, setOpenSettingModal] = useState(false);
	const { state } = useContext(AppContext);
	return (
		<div className={channelManagemetStyle.channleSettings}>
			<Button
				variant="outlined"
				color="primary"
				size="large"
				onClick={() => setOpenSettingModal(true)}
				endIcon={<SettingsIcon />}
			>
				SETTINGS
			</Button>
			{openSettingModal && (
				<Modal
					isOpen={openSettingModal}
					// onAfterOpen={afterOpenModal}
					onRequestClose={() => setOpenSettingModal(false)}
					style={{
						overlay: {
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(22, 28, 36, 0.5)",
						},
						content: {
							top: "30%",
							left: "50%",
							right: "auto",
							bottom: "auto",
							marginRight: "-50%",
							transform: "translate(-50%, 0%)",
							width: "400px",
							minHeight: "300px",
							border: "none",
							borderRadius: "20px",
							backgroundColor: "#212B36",
							display: "flex",
							flexDirection: "column",
							alignContent: "center",
							justifyContent: "flex-start",
						},
					}}
					contentLabel="Example Modal"
				>
					{(state.receiver.admins.includes(state.mainUser.id) ||
						state.receiver.owner === state.mainUser.id) && (
						<ManageMembers
							room={state.receiver}
							mainUser={state.mainUser}
							chatSocket={props.chatSocket}
							setOpenSettingModal={setOpenSettingModal}
						/>
					)}
					<button
						className={
							channelManagemetStyle.room_button +
							" " +
							channelManagemetStyle.leave_room
						}
						onClick={props.leaveRoom}
					>
						leave
					</button>
				</Modal>
			)}
		</div>
	);
}

function JoinProtectedRoom(props: any) {
	const [password, setPassword] = useState<string>("");
	const [validatePasswordState, setValidatePasswordState] = useState(false);
	const [passwordIsWrong, setPasswordIsWrong] = useState(false);
	const { setIsUserJoinedChannel } = useContext(AppContext);

	function handleForm(e: any) {
		e.preventDefault();
		if (password.length) {
			setValidatePasswordState(false);
			props.chatSocket.emit(
				"CHECK_ROOM_PASSWORD",
				{ room_id: props.room_id, password: password },
				(responce: any) => {
					
					if (responce === false) {
						setPasswordIsWrong(true);
					} else {
						setPasswordIsWrong(false);
						setIsUserJoinedChannel(true);
						props.joinRoom();
						props.setOpenPasswordModal(false);
					}
				}
			);
		} else {
			setValidatePasswordState(true);
		}
	}

	return (
		<div className={channelManagemetStyle.joinProtectedRoom}>
			<form onSubmit={(e) => handleForm(e)}>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					placeholder="channel Password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				{validatePasswordState && (
					<InputError message="Enter Password" />
				)}
				{passwordIsWrong && <InputError message="wrong Password" />}
				<button
					type="submit"
					className={channelManagemetStyle.room_button}
				>
					submit
				</button>
			</form>
		</div>
	);
}

export default function ChannelManagement({
	joinRoom,
	leaveRoom,
	chatSocket,
}: {
	joinRoom: () => void;
	leaveRoom: () => void;
	chatSocket: any;
}) {
	const { state, setIsUserJoinedChannel, setReceiver } = useContext(
		AppContext
	);
	
	const [openPasswordModal, setOpenPasswordModal] = useState(false);
	function ChannalJoinHandle() {
		if (state.receiver.isProtected) {
			
			setOpenPasswordModal(true);
		} else {
			
			setIsUserJoinedChannel(true);
			joinRoom();
		}
	}

	useEffect(() => {
		const receiver = state.receiver;
		const newReceiver = state.channels.filter(
			(channel: Channel) => channel.id === receiver.id
		);
		if (JSON.stringify(receiver) !== JSON.stringify(newReceiver[0])) {
			
			if (newReceiver[0]) setReceiver({ ...newReceiver[0] });
			else setReceiver(null);
		}
	}, [state.channels]);

	return (
		<>
			<div className={channelManagemetStyle.room_management}>
				{!state.isUserJoinedChannel ? (
					<button
						className={channelManagemetStyle.room_button}
						onClick={ChannalJoinHandle}
					>
						join
					</button>
				) : (
					<ChannelSettings
						leaveRoom={leaveRoom}
						chatSocket={chatSocket}
					/>
				)}
			</div>
			<Modal
				isOpen={openPasswordModal}
				// onAfterOpen={afterOpenModal}
				onRequestClose={() => setOpenPasswordModal(false)}
				style={{
					overlay: {
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(22, 28, 36, 0.5)",
					},
					content: {
						top: "50%",
						left: "50%",
						right: "auto",
						bottom: "auto",
						marginRight: "-50%",
						transform: "translate(-50%, -50%)",
						minWidth: "400px",
						height: "250px",
						border: "none",
						borderRadius: "20px",
						backgroundColor: "#212B36",
					},
				}}
				contentLabel="Example Modal"
			>
				<JoinProtectedRoom
					chatSocket={chatSocket}
					setOpenPasswordModal={setOpenPasswordModal}
					room_id={state.receiver.id}
					joinRoom={joinRoom}
				/>
			</Modal>
		</>
	);
}
