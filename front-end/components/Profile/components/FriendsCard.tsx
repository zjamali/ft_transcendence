import { Button } from "@mui/material"
import Image from "next/image"
import img from "../public/abstract.jpeg"
import NoiseControlOffIcon from '@mui/icons-material/NoiseControlOff';
import HideSourceIcon from '@mui/icons-material/HideSource';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CircleIcon from '@mui/icons-material/Circle';


const FriendsCard = () => {
	return (
		<div style={{margin:"0", padding:"0", width:"90%", height:"100%"}}>
			<div className="friends-card">
				<div className="friends-card-img"><Image src={img} alt="img-user" layout="fill"/></div>
				<div className="friends-card-name"><p>name</p></div>
				<div className="friends-card-state"><Button variant="outlined" size="small" color="success"startIcon={<NoiseControlOffIcon/>} sx={{width: 100}}> Online</Button></div>
			</div>
			<div className="friends-card">
				<div className="friends-card-img"><Image src={img} alt="img-user" layout="fill"/></div>
				<div className="friends-card-name"><p>name</p></div>
				<div className="friends-card-state"><Button variant="outlined" size="small" color="error" sx={{width: 100}} startIcon={<HideSourceIcon/>}>Offline</Button></div>
			</div>
			<div className="friends-card">
				<div className="friends-card-img"><Image src={img} alt="img-user" layout="fill"/></div>
				<div className="friends-card-name"><p>name</p></div>
				<div className="friends-card-state"><Button variant="outlined" size="small" color="warning" startIcon={<SportsEsportsIcon/>}>in game</Button></div>
			</div>
		</div>
	)
}

export default FriendsCard