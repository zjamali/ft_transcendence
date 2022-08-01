import Image from "next/image"
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { acceptFriendRequest, unfriend } from "../../utils/utils";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CloseIcon from '@mui/icons-material/Close';

const Notification = (props) => {
	return (
		<div>
			<MenuItem  style={{color: "#919eab", height: '40px'}}>
				<div style={{position: 'relative', borderRadius: '50px', overflow: 'hidden', width: '30px', height: '30px'}}>
					<Image loader={()=> props.user.image} src={props.user.image} unoptimized={true} alt="avatar" layout="fill" />
				</div>
				<div style={{marginLeft: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
					<div>{props.user.userName}</div>
					<div style={{marginLeft: '80px'}}>
					<IconButton color="error" onClick={(e)=> {e.preventDefault(); unfriend(props.user.id) }}>
						<CloseIcon/>
					</IconButton>
					<IconButton color="success" onClick={(e)=> {e.preventDefault(); acceptFriendRequest(props.user.id)  }}>
						<DoneRoundedIcon/>
					</IconButton>
					</div>
				</div>
			</MenuItem>
			<Divider />
		</div>
	)
}

export default Notification