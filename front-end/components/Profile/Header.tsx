import Image from "next/image";
// import intra from '../../..//public/42.jpg'
import logoImg from "../../public/ponglogo.svg";
import DropDown from "./DropDown";
import DropDNotifications from "./DropDNotifications";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { eventsSocket } from "../../context/sockets";

const Header = (props:any) => {
	const { state, setMainUser } = useContext(AppContext);
	const userName: string = state.mainUser.userName;
	let src: string = state.mainUser.image;

	useEffect(() => {
		state.eventsSocket.on("A_PROFILE_UPDATE", (user: any) => {
			console.log("update profile image : ", user);
			setMainUser({ ...user });
		});
		return () => {
			state.eventsSocket.off("A_PROFILE_UPDATE");
		};
	}, []);

	return (
		<header className="header">
			<div className="logo-container">
				<Image
					src={logoImg}
					className="img-logo"
					alt="this is the logo"
					layout="fill"
				/>
			</div>
			<div className="left-items">
				<div className="notifications-container">
					<DropDNotifications/>
				</div>
				<div className="user-container">
					<DropDown userName={userName} image={src} />
				</div>
			</div>
		</header>
	);
};

export default Header;
