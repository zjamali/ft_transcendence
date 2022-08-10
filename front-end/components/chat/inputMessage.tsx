/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import inputMessageStyle from "../../styles/Chat.module.css";
interface InputMessageInterface {
	sendMessage: (e: any, inputMessage: string) => void;
	// messageInput: string
	// setMessageinput: (e: any) => void
}

export function InputMessage({
	sendMessage,
}: // messageInput,
// setMessageinput,
InputMessageInterface) {
	const { state } = useContext(AppContext);

	useEffect(() => {
		// just the receiver changed
	}, [state.receiver]);

	const handleMessage = (e: any) => {
		e.preventDefault();

		if (
			!/^\s+$/g.test(messageInput) &&
			messageInput.length > 0 &&
			messageInput.length <= 100
		) {
			sendMessage(e, messageInput);
			setMessageinput("");
		}
	};

	const [messageInput, setMessageinput] = useState<string>("");

	return (
		<div className={inputMessageStyle.message_input}>
			<form
				onSubmit={(e) => {
					handleMessage(e);
				}}
			>
				<input
					maxLength={100}
					type="text"
					name="message"
					id="message_content"
					value={messageInput}
					onChange={(e) => {
						setMessageinput(e.target.value);
					}}
				/>
				<button type="submit">
					<img
						src="/images/icons/send_icon.png"
						alt="send"
						width={20}
						height={20}
					/>{" "}
				</button>
			</form>
		</div>
	);
}
