
import Image from "next/image"
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import intra from "../public/42.jpg"


const Notification: React.FC = ({...props}) => {
	const username: string = "asaadi"
	return (
		<div>
			<MenuItem  style={{color: "#919eab", height: '40px'}}>
				<div style={{position: 'relative', borderRadius: '50px', overflow: 'hidden', width: '30px', height: '30px'}}>
					<Image src={intra} alt="avatar" layout="fill" />
				</div>
				<div style={{marginLeft: '10px',}}>
					<p style={{color: 'white', display: "inline"}}>{username}</p> messaged you 
				</div>
			</MenuItem>
			<Divider />
		</div>
	)
}

export default Notification