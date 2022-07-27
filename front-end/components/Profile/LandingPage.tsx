import { Button } from '@mui/material'
// import "../styles/LandingPage.css"
// import classes from "../styles/LandingPage.module.css"
import Image from 'next/image'
import pic42 from "../public/42.jpg";
import playerImg from "../public/player1.svg"
import logoImg from "../public/ponglogo.svg"
import LoginIcon from '@mui/icons-material/Login';

export default function LandingPage() {

	return (
		<div>
			<div className={"container"}>
				<div className="container__left">
					<div className={"container__up"}>
						<div className="div__logo">
							<Image className="img__logo" src={logoImg} alt="this is the logo" height="90em" width="90em" />
						</div>
						<div className={"login__button_1"}>
							<Button variant="contained" size="small" startIcon={<LoginIcon />} style={{backgroundColor:"#ff4842 ", borderRadius: "10px", letterSpacing: "2px",width: "35%", fontSize: "0.7rem"}}>Login</Button>
						</div>
					</div>
					<div className={"div__player"}>
						<Image className={"img__player"} src={playerImg} alt="a ping pong player"  layout="fill"/>
					</div>
				</div>
				<div className={"container__right"}>
					<div className={"login"}>
						<div className={"login__image"}>
							<Image className={"image__42"} src={pic42} alt="A 42 image " objectFit="cover" layout='fill' />
						</div>
						<div className={"login__button"}>
							<Button variant="contained" size="medium" startIcon={<LoginIcon />} style={{backgroundColor:"#ff4842 ", borderRadius: "12px", width: "35%", letterSpacing: "2px", fontSize: "1vw"}}>Login</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}