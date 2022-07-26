import Image from "next/image";
import intra from "../public/42.jpg"
import logoImg from "../public/ponglogo.svg"
import DropDown from "./DropDown";
import DropDNotifications from "./DropDNotifications";

const Header = () => {
	const userName: string = "abdait-m"

	return (
		<header className="header">
			<div className="logo-container">
				<Image className="img-logo" src={logoImg} alt="this is the logo"  layout="fill"/>
			</div>
			<div className="left-items">
				<div className="notifications-container">
					<DropDNotifications />
					{/* <button className="btn-notification">
					<svg xmlns="http://www.w3.org/2000/svg"className="notification-icon" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/></svg>
					</button> */}
				</div>
				{/* <div className="header-user-name">{userName}</div> */}
				<div className="user-container">
					<DropDown userName={userName}/>
				</div>
			</div>
		</header>
	)
}

export default Header