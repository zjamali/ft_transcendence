import Image from "next/image"
import img from "../../public/abstract.jpeg"
import { Button } from "@mui/material"
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import { ChatContext } from "../../context/chatContext";
import { useContext } from "react";


const HistoryCard = () => {
	const {state} = useContext(ChatContext)
	const mainUserName = state.mainUser.userName
	const mainUserImage = state.mainUser.image

	return (
		<div style={{margin:"0", padding:"0", width:"90%", height:"100%"}}>
			<div className="history-card">
				<div className="admin-card">
					<div className="history-card-img"><Image loader={() => mainUserImage} unoptimized={true} src={mainUserImage} alt="img-user" layout="fill"/></div>
					<div className="friends-card-name"><p style={{fontSize:"13px", textAlign:"center", lineHeight:"20px" }}>{mainUserName}</p></div>
				</div>
				<div className="score-card">
					<h4>
						<Button variant="outlined" size="medium" 
					 	sx={{
							 "&::before": {
								content: `"Score"`,
								fontWeight: '400',
								fontSize: '12px',
								color: '#10AA88',
								position: 'relative',
								bottom: '26px',
								left: '32px',
								width: 0,
							},
							// width: '150px',
							color: '#109688', borderColor: '#109688', 
							"&:hover": {
								borderColor: "#10AA88",
								color: "#10AA88",
							}
						}} startIcon={<VideogameAssetIcon/>} endIcon={<VideogameAssetIcon/>}
						>
							10 vs 16
						</Button>
					</h4>
				</div>
				<div className="opponent-card">
					<div className="history-card-img"><Image src={img} alt="img-user" layout="fill"/></div>
					<div className="friends-card-name"><p style={{fontSize:"13px", textAlign:"center", lineHeight:"20px"}}>aeddaqqa</p></div>
				</div>
			</div>
		</div>
	)
}

export default HistoryCard