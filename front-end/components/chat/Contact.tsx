import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import ContactStyles from "../../styles/Chat.module.css";
import Avatar from "./avatar";
import { ContactComponentProps, User } from "../../utils/interfaces";

function Contact(props: ContactComponentProps) {
	const { setReceiver, state } = useContext(AppContext);

	function handleChangeReceiver() {
		//console.log("set receiver in contact component : ",state.contacts);
		//const contacts = state.contacts;
		//console.log("contacts : ", contacts , "  receiver id : ", receiver_id);
		//const receiver = contacts.filter((contact : User)=> contact.id === receiver_id);
		//console.log("new receiver : ", receiver[0]);
		//if (state.receiver?.id != receiver[0].id )
		//  setReceiver({...receiver[0]});
		if (state.receiver?.id != props.contact.id) setReceiver(props.contact);
	}

	return (
		<div
			className={
				props.contact.id === props.receiver.id
					? ContactStyles.contact +
					  " " +
					  ContactStyles.selected_contact
					: ContactStyles.contact
			}
			onClick={() => handleChangeReceiver()}
		>
			<div className={ContactStyles.contact_avatar}>
				<Avatar image={props.contact.image} />
				<h4>
					{props.contact.firstName + " " + props.contact.lastName}
				</h4>
			</div>
			<div className={ContactStyles.contact_status}>
				{props.contact.isPlaying && (
					<div className={ContactStyles.playing}>playing</div>
				)}
				{props.contact.isOnline && (
					<div className={ContactStyles.onlineCircle}></div>
				)}
				{!props.contact.isOnline && (
					<div className={ContactStyles.offlineCircle}></div>
				)}
			</div>
		</div>
	);
}

export default Contact;
