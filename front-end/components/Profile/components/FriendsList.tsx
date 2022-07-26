import { Button } from "@mui/material"
import Image from "next/image"
import intra from "../public/42.jpg"


const FriendsList: React.FC = () => {

	return (
		<div className="profile-data" style={{}}>
			<div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px',}}>
				<h2 style={{marginBottom: '25px', fontWeight: '300'}}>Friends</h2>
				<div style={{display: 'flex', flexDirection: 'row', alignContent: 'stretch', justifyContent: 'left',flexWrap:'wrap', gap: '15px'}}>
					<div className="wall-friend-card">
						<div style={{position: "relative", width: '85px', height: '85px', borderRadius: '50px', overflow: 'hidden'}}>
							<Image src={intra} alt="user avatar" layout="fill"/>
						</div>
						<div style={{marginBottom: '25px', color: '#919eab'}}>
							username
						</div>
						<div>
							<Button variant="outlined" size="small" color="error" >remove</Button>
						</div>
					</div>
					<div className="wall-friend-card">
						<div style={{position: "relative", width: '85px', height: '85px', borderRadius: '50px', overflow: 'hidden'}}>
							<Image src={intra} alt="user avatar" layout="fill"/>
						</div>
						<div style={{marginBottom: '25px', color: '#919eab'}}>
							username
						</div>
						<div>
							<Button variant="outlined" size="small" color="error" >remove</Button>
						</div>
					</div>
					<div className="wall-friend-card">
						<div style={{position: "relative", width: '85px', height: '85px', borderRadius: '50px', overflow: 'hidden'}}>
							<Image src={intra} alt="user avatar" layout="fill"/>
						</div>
						<div style={{marginBottom: '25px', color: '#919eab'}}>
							username
						</div>
						<div>
							<Button variant="outlined" size="small" color="error" >remove</Button>
						</div>
					</div>
					<div className="wall-friend-card">
						<div style={{position: "relative", width: '85px', height: '85px', borderRadius: '50px', overflow: 'hidden'}}>
							<Image src={intra} alt="user avatar" layout="fill"/>
						</div>
						<div style={{marginBottom: '25px', color: '#919eab'}}>
							username
						</div>
						<div>
							<Button variant="outlined" size="small" color="error" >remove</Button>
						</div>
					</div>
					<div className="wall-friend-card">
						<div style={{position: "relative", width: '85px', height: '85px', borderRadius: '50px', overflow: 'hidden'}}>
							<Image src={intra} alt="user avatar" layout="fill"/>
						</div>
						<div style={{marginBottom: '25px', color: '#919eab'}}>
							username
						</div>
						<div>
							<Button variant="outlined" size="small" color="error" >remove</Button>
						</div>
					</div>
					<div className="wall-friend-card">
						<div style={{position: "relative", width: '85px', height: '85px', borderRadius: '50px', overflow: 'hidden'}}>
							<Image src={intra} alt="user avatar" layout="fill"/>
						</div>
						<div style={{marginBottom: '25px', color: '#919eab'}}>
							username
						</div>
						<div>
							<Button variant="outlined" size="small" color="error" >remove</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FriendsList