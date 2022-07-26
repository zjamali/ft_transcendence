import Image from "next/image"
import img from "../public/abstract.jpeg"

const HistoryCard = () => {
	return (
		<div style={{margin:"0", padding:"0", width:"90%", height:"100%"}}>
			<div className="history-card">
				<div className="admin-card">
					<div className="history-card-img"><Image src={img} alt="img-user" layout="fill"/></div>
					<div className="friends-card-name"><p style={{fontSize:"13px", textAlign:"center", lineHeight:"20px" }}>abdait-m</p></div>
				</div>
				<div className="score-card">
					<h4>score</h4>
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