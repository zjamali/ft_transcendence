import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import reciverStyle from "../../styles/Chat.module.css";
import Avatar from "./avatar";
import RoomAvatar from "react-avatar";
import SportsEsportsTwoToneIcon from "@mui/icons-material/SportsEsportsTwoTone";

import { isContact } from "../../utils/utils";
import ChannelManagement from "./ChannelManagemet";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

export default function Reciever({
	joinRoom,
	leaveRoom,
	chatSocket,
}: {
	joinRoom: () => void;
	leaveRoom: () => void;
	chatSocket: any;
}) {
	const router = useRouter();
	const { state, setIsUserJoinedChannel } = useContext(AppContext);

	useEffect(() => {
		if (!isContact(state.receiver)) {
			setIsUserJoinedChannel(
				state.receiver.ActiveUsers?.includes(state.mainUser.id)
			);
		}
	}, [state.receiver, state.Channels]);

	const gameHandleInvite = () => {
		if (state.eventsSocket)
			state.eventsSocket.emit("send_game_invitaion_to_server", {
				sender: state.mainUser,
				receiver: state.receiver,
				game_room: `${state.mainUser.id}${state.receiver.id}`,
			});
		// router.push('/game');
	};

	return (
		<>
			{isContact(state.receiver) ? (
				<div className={reciverStyle.main_user}>
					<Link href={`/users/${state.receiver.id}`}>
						<a>
							<Avatar image={state.receiver.image} />
						</a>
					</Link>
					<div>
						<h3>{`${state.receiver.firstName} ${state.receiver.lastName}`}</h3>
						<p>@{state.receiver.userName}</p>
					</div>
					<div>
						<Button
							variant="outlined"
							color="primary"
							size="large"
							onClick={gameHandleInvite}
							startIcon={<SportsEsportsTwoToneIcon />}
						disabled={state.receiver.isPlaying}
						>
							invite
						</Button>
					</div>
				</div>
			) : (
				<>
					<div className={reciverStyle.receiver_Channel}>
						<div className={reciverStyle.receiverInfo}>
							<RoomAvatar
								name={state.receiver.roomName}
								size="50"
								round={true}
							/>
							<div>
								<h3>{state.receiver.roomName}</h3>
							</div>
						</div>
						{state.receiver && (
							<ChannelManagement
								chatSocket={chatSocket}
								joinRoom={joinRoom}
								leaveRoom={leaveRoom}
							/>
						)}
					</div>
				</>
			)}
		</>
	);
}
